import path from "path";
import db from "../utils/db.js";

const dbPath = path.resolve("data/warehouse/agri_data.duckdb");

export async function getAnomalies(req, res) {
  try {
    const query = `
      SELECT *
      FROM readings
      WHERE anomalous_reading = true;
    `;

    const results = await db.execute(query, dbPath);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
