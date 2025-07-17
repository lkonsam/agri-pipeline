import db from "../utils/db.js";
import path from "path";

const dbPath = path.resolve("data/warehouse/agri_data.duckdb");

export async function getSummary(req, res) {
  try {
    const { sensor_id, reading_type, from, to } = req.query;

    let conditions = [];
    if (sensor_id) conditions.push(`sensor_id = '${sensor_id}'`);
    if (reading_type) conditions.push(`reading_type = '${reading_type}'`);
    if (from) conditions.push(`timestamp >= '${from}'`);
    if (to) conditions.push(`timestamp <= '${to}'`);

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";
    // console.log(whereClause);

    const query = `
      SELECT 
        sensor_id,
        reading_type,
        COUNT(*) AS count,
        ROUND(AVG(value), 2) AS avg_value,
        ROUND(MIN(value), 2) AS min_value,
        ROUND(MAX(value), 2) AS max_value
      FROM readings
      ${whereClause}
      GROUP BY sensor_id, reading_type;
    `;
    // console.log(query);

    const results = await db.execute(query, dbPath);

    const safeResults = results.map((row) => {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          typeof value === "bigint" ? Number(value) : value,
        ])
      );
    });

    res.json(safeResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
