/**
 * Step 6: Normalize Sensor Values
 */
const calibrationParams = {
  temperature: { multiplier: 1.02, offset: -0.5 },
  humidity: { multiplier: 0.98, offset: 1.0 },
};

export default function normalizeValues(data) {
  return data.map((row) => {
    const { multiplier, offset } = calibrationParams[row.reading_type] || {
      multiplier: 1,
      offset: 0,
    };
    return {
      ...row,
      normalized_value: row.value * multiplier + offset,
    };
  });
}
