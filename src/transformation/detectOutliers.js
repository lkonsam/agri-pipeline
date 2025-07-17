import { logSuccess } from "../utils/logger.js";
import { mean, std } from "mathjs";

/**
 * Step 3: Flag outliers using Z-score method
 */
export default function detectOutliers(data) {
  const grouped = {};
  for (const row of data) {
    const key = row.reading_type;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row.value);
  }

  const stats = {};
  for (const type in grouped) {
    stats[type] = {
      mean: mean(grouped[type]),
      std: std(grouped[type]),
    };
  }

  const flagged = data.map((row) => {
    const { mean, std } = stats[row.reading_type];
    const z = std === 0 ? 0 : Math.abs((row.value - mean) / std);
    return {
      ...row,
      z_score: z,
      is_outlier: z > 3,
    };
  });

  const outliers = flagged.filter((r) => r.is_outlier).length;
  logSuccess(`📊 Flagged ${outliers} outliers with z-score > 3`);

  return flagged;
}
