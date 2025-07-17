import duckdb from "duckdb";

class DB {
  constructor() {
    this.memoryDb = new duckdb.Database(":memory:");
    this.memoryConn = this.memoryDb.connect();
    this.fileConnections = new Map();
  }

  /**
   * Get a file-based connection (creates if doesn't exist)
   * @param {string} dbPath
   * @returns {Promise<duckdb.Connection>}
   */
  async getFileConnection(dbPath) {
    if (this.fileConnections.has(dbPath)) {
      const conn = this.fileConnections.get(dbPath);
      if (!conn.closed) return conn;
    }

    return new Promise((resolve, reject) => {
      try {
        const db = new duckdb.Database(dbPath);
        const conn = db.connect();
        this.fileConnections.set(dbPath, conn);
        resolve(conn);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Execute a query
   * @param {string} query
   * @param {string} [dbPath] Optional file path for file-based DB
   * @returns {Promise<any[]>}
   */
  async execute(query, dbPath) {
    const conn = dbPath
      ? await this.getFileConnection(dbPath)
      : this.memoryConn;

    return new Promise((resolve, reject) => {
      conn.all(query, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  /**
   * Close a file-based connection
   * @param {string} dbPath
   */
  async closeFileConnection(dbPath) {
    if (this.fileConnections.has(dbPath)) {
      const conn = this.fileConnections.get(dbPath);
      if (!conn.closed) {
        conn.close();
      }
      this.fileConnections.delete(dbPath);
    }
  }

  /**
   * Close all connections
   */
  async closeAll() {
    for (const [path, conn] of this.fileConnections) {
      if (!conn.closed) {
        conn.close();
      }
    }
    this.fileConnections.clear();
  }
}

// Singleton instance
const dbInstance = new DB();

export default dbInstance;
