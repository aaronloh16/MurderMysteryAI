import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// For Next.js edge runtime, you'd use a different client
// This is for Node.js runtime
const pool = new Pool({
	connectionString: process.env.POSTGRES_URL,
});

export const db = drizzle(pool, { schema });
