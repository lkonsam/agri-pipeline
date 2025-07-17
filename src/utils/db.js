// src/utils/db.js
import duckdb from "duckdb";

export const db = new duckdb.Database(":memory:");

/**
 * Runs a DuckDB SQL query and returns the result as a Promise.
 * @param {string} query
 * @returns {Promise<any[]>}
 */
export function runQuery(query) {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
