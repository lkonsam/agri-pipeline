// src/utils/checkpoint.js
import fs from "fs";
import path from "path";

const CHECKPOINT_FILE = "./data/checkpoint/checkpoint.json";

/**
 * Gets the name of the last processed file from checkpoint.
 */
export function getCheckpoint() {
  if (!fs.existsSync(CHECKPOINT_FILE)) return null;

  try {
    const data = fs.readFileSync(CHECKPOINT_FILE, "utf-8");
    return JSON.parse(data).lastFile;
  } catch (err) {
    console.error("⚠️ Failed to read checkpoint:", err.message);
    return null;
  }
}

/**
 * Updates the checkpoint with the latest successfully processed file.
 * @param {string} fileName
 */
export function updateCheckpoint(fileName) {
  try {
    fs.writeFileSync(
      CHECKPOINT_FILE,
      JSON.stringify({ lastFile: fileName }, null, 2)
    );
    console.log(`✅ Checkpoint updated: ${fileName}`);
  } catch (err) {
    console.error("⚠️ Failed to update checkpoint:", err.message);
  }
}
