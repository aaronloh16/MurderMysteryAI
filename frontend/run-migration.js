// Load environment variables
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const fs = require('fs');
const path = require('path');

// Ensure the migrations folder exists
const migrationsFolder = path.join(__dirname, 'db', 'migrations');
if (!fs.existsSync(migrationsFolder)) {
	console.error(`Migrations folder not found: ${migrationsFolder}`);
	process.exit(1);
}

// Get connection string
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
	console.error('POSTGRES_URL environment variable is not set in .env.local');
	process.exit(1);
}

console.log('Running migrations...');

// Create a PostgreSQL connection
const pool = new Pool({
	connectionString,
});

const db = drizzle(pool);

// Run migrations
migrate(db, { migrationsFolder })
	.then(() => {
		console.log('Migrations completed successfully!');
		pool.end();
	})
	.catch((error) => {
		console.error('Migration failed:', error);
		pool.end();
		process.exit(1);
	});
