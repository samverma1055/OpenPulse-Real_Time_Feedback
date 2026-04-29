import pool from "./postgresConnection.js";

export const setupPgTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      action VARCHAR(100) NOT NULL,
      performed_by VARCHAR(255),
      details TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("✅ PostgreSQL tables ready");
};