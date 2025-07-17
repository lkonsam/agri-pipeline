import { mean } from "mathjs";
import { DateTime } from "luxon";

/**
 * Step 4: Add timestamp formatting and daily averages
 */

export function convertTimestampToDate(ts) {
  // Convert to millis if it's a Date object
  const millis = ts instanceof Date ? ts.getTime() : ts;
  return DateTime.fromMillis(millis).setZone("Asia/Kolkata").toISODate();
}

export default function enrichWithAverages(data) {
  const enriched = data.map((row) => ({
    ...row,
    date: convertTimestampToDate(row.timestamp),
  }));

  // Group by date+sensor+reading_type
  const groups = {};
  for (const row of enriched) {
    const key = `${row.sensor_id}_${row.reading_type}_${row.date}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(row.value);
  }

  const dailyAvgMap = {};
  for (const key in groups) {
    dailyAvgMap[key] = mean(groups[key]);
  }

  return enriched.map((row) => {
    const key = `${row.sensor_id}_${row.reading_type}_${row.date}`;
    return {
      ...row,
      daily_avg: dailyAvgMap[key],
    };
  });
}
