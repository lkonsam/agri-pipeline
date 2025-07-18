import fs from "fs";
import path from "path";

const CHECKPOINT_DIR = "./data/checkpoint";
const CHECKPOINT_FILE = path.join(CHECKPOINT_DIR, "checkpoint.json");

/**
 * Loads the checkpoint JSON, or returns default structure if file doesn't exist.
 */
function loadCheckpoint() {
  if (!fs.existsSync(CHECKPOINT_FILE)) return {};
  try {
    const data = fs.readFileSync(CHECKPOINT_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("⚠️ Failed to read checkpoint:", err.message);
    return {};
  }
}

/**
 * Saves updated checkpoint to file.
 * @param {object} checkpoint
 */
function saveCheckpoint(checkpoint) {
  try {
    fs.mkdirSync(CHECKPOINT_DIR, { recursive: true });
    fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2));
  } catch (err) {
    console.error("⚠️ Failed to write checkpoint:", err.message);
  }
}

/**
 * Gets the last checkpoint value for a given stage (e.g., 'lastIngested').
 */
export function getCheckpoint(stage) {
  const checkpoint = loadCheckpoint();
  return checkpoint[stage] || null;
}

/**
 * Updates the checkpoint file for a given stage.
 * @param {string} stage - "lastIngested", "lastTransformed", "lastValidated"
 * @param {string} fileName
 */
export function updateCheckpoint(stage, fileName) {
  const checkpoint = loadCheckpoint();
  checkpoint[stage] = fileName;
  saveCheckpoint(checkpoint);
  console.log(`✅ Checkpoint updated [${stage}]: ${fileName}`);
}
