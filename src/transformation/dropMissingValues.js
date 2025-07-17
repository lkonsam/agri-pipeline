import { logSuccess } from "../utils/logger.js";

/**
 * Step 2: Drop rows with missing/null fields
 */
export default function dropMissingValues(data) {
  const requiredFields = [
    "sensor_id",
    "timestamp",
    "reading_type",
    "value",
    "battery_level",
  ];

  const cleaned = data.filter((row) =>
    requiredFields.every((key) => row[key] !== null && row[key] !== undefined)
  );

  logSuccess(
    `🧹 Dropped ${data.length - cleaned.length} rows with missing values`
  );
  return cleaned;
}
