import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL from environment variables (Render provides this automatically)
let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
} else {
  console.warn("DATABASE_URL not set. Running without database connection.");
}

export const query = (text: string, params?: any[]) => {
  if (!pool) {
    return Promise.reject(new Error("Database not configured"));
  }
  return pool.query(text, params);
};
