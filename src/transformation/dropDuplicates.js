import { logSuccess } from "../utils/logger.js";

/**
 * Step 1: Remove exact duplicate records
 */
export default function dropDuplicates(data) {
  const seen = new Set();
  const deduped = [];

  for (const row of data) {
    const key = JSON.stringify(row);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(row);
    }
  }

  logSuccess(`🧹 Dropped ${data.length - deduped.length} duplicates`);
  return deduped;
}
