/**
 * Step 5: Add static expected range per reading type
 */
const expectedRanges = {
  temperature: { min: 10, max: 40 },
  humidity: { min: 20, max: 90 },
};

export default function flagAnomalies(data) {
  return data.map((row) => {
    const range = expectedRanges[row.reading_type] || {
      min: -Infinity,
      max: Infinity,
    };
    const isAnomalous = row.value < range.min || row.value > range.max;

    return {
      ...row,
      anomalous_reading: isAnomalous,
    };
  });
}
