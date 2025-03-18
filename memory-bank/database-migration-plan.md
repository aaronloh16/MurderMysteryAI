# Database Migration Plan: Moving to Neon & Drizzle ORM

## Overview

This document outlines our plan to migrate from the current file-based data approach to a proper database solution using Neon (serverless Postgres) and Drizzle ORM. This migration will improve data management, enable scalability, and prepare the Murder Mystery AI project for production.

## What are Neon and Drizzle?

### Neon Database Explained

Neon is a serverless Postgres database service. Here's what makes it great for projects like ours:

- **Serverless Architecture**: Only pay for what you use; scales down to zero when not in use
- **Modern Postgres**: Fully compatible with PostgreSQL, the industry-standard relational database
- **Free Developer Tier**: Generous free tier perfect for development and small projects
- **Branch Feature**: Allows creating isolated database environments for testing (like Git branches)
- **Simple Connection**: Uses standard Postgres connection strings

Think of Neon as a powerful Postgres database running in the cloud without you needing to manage servers.

### Drizzle ORM Explained

Drizzle is a lightweight TypeScript ORM (Object-Relational Mapper) that bridges the gap between your database and code:

- **What is an ORM?** An ORM translates between your database tables and your application code, so you can work with database data using TypeScript objects and methods instead of writing raw SQL.
- **TypeScript-First**: Provides full type safety for database operations
- **Lightweight**: Simpler and more transparent than heavier ORMs
- **SQL-like Syntax**: Feels familiar if you know SQL, unlike some other ORMs
- **Fully Open Source**: Community-driven development with MIT license

Unlike Prisma (another popular ORM), Drizzle:

- Defines schema directly in TypeScript rather than a separate schema language
- Has lighter runtime requirements
- Doesn't require a separate client generation step
- More directly maps to underlying SQL concepts

## Current Limitations

Our current approach has several limitations:

1. **Brittle Data Access**: Python parsing TypeScript files is error-prone and tightly coupled
2. **No Data Persistence**: Changes are lost on restart
3. **Limited Scalability**: File-based approach doesn't scale well
4. **Deployment Complexity**: File paths must be maintained across environments
5. **No Concurrent Access Control**: Multiple processes could lead to race conditions

## Why Neon & Drizzle?

### Neon Benefits

- **Serverless Postgres**: Scales to zero when not in use (cost-effective)
- **Generous Free Tier**: Perfect for development and small projects
- **PostgreSQL Compatibility**: Industry-standard database with robust features
- **Branching Capability**: Create isolated database branches for testing

### Drizzle Benefits

- **Open Source**: MIT licensed and community-driven
- **Type Safety**: Full TypeScript integration
- **Low Overhead**: Lightweight with minimal runtime impact
- **SQL-like Query Builder**: Intuitive for those familiar with SQL
- **No Schema Language**: Define schema directly in TypeScript code
- **Migrations**: Simple SQL-based migrations

## Implementation Steps

### 1. Set Up Neon Database (1 day)

1. **Create Neon Account**

   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project

2. **Set Up Database**

   - Create a new database named `murder_mystery`
   - Create a dedicated user with appropriate permissions
   - Save connection string securely

3. **Configure Connection**
   - Add connection string to environment variables
   - Update `.env.local` files with database credentials (format: `POSTGRES_URL=postgres://user:password@hostname/dbname`)

### 2. Set Up Drizzle in Next.js Project (1 day)

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install drizzle-orm pg
   npm install -D drizzle-kit @types/pg
   ```

2. **Create Database Schema**
   Create `frontend/db/schema.ts`:

   ```typescript
   import {
   	pgTable,
   	text,
   	boolean,
   	serial,
   	varchar,
   } from 'drizzle-orm/pg-core';
   import { relations } from 'drizzle-orm';

   // Suspects table
   export const suspects = pgTable('suspects', {
   	id: text('id').primaryKey(),
   	name: text('name').notNull(),
   	role: text('role').notNull(),
   	description: text('description').notNull(),
   	isGuilty: boolean('is_guilty').notNull(),
   	gender: text('gender').notNull(),
   });

   // Context table (1-to-1 with suspects)
   export const contexts = pgTable('contexts', {
   	id: serial('id').primaryKey(),
   	background: text('background').notNull(),
   	personality: text('personality').notNull(),
   	alibi: text('alibi').notNull(),
   	suspectId: text('suspect_id')
   		.notNull()
   		.references(() => suspects.id)
   		.unique(),
   });

   // Secrets table (many-to-1 with suspects)
   export const secrets = pgTable('secrets', {
   	id: serial('id').primaryKey(),
   	content: text('content').notNull(),
   	suspectId: text('suspect_id')
   		.notNull()
   		.references(() => suspects.id),
   });

   // StoryContext table
   export const storyContext = pgTable('story_context', {
   	id: text('id').primaryKey().default('main'),
   	title: text('title').notNull(),
   	description: text('description').notNull(),
   	location: text('location').notNull(),
   	victim: text('victim').notNull(),
   	murderWeapon: text('murder_weapon').notNull(),
   });

   // Define relationships
   export const suspectsRelations = relations(suspects, ({ one, many }) => ({
   	context: one(contexts, {
   		fields: [suspects.id],
   		references: [contexts.suspectId],
   	}),
   	secrets: many(secrets),
   }));

   export const contextsRelations = relations(contexts, ({ one }) => ({
   	suspect: one(suspects, {
   		fields: [contexts.suspectId],
   		references: [suspects.id],
   	}),
   }));

   export const secretsRelations = relations(secrets, ({ one }) => ({
   	suspect: one(suspects, {
   		fields: [secrets.suspectId],
   		references: [suspects.id],
   	}),
   }));
   ```

3. **Create Database Connection**
   Create `frontend/db/index.ts`:

   ```typescript
   import { drizzle } from 'drizzle-orm/node-postgres';
   import { Pool } from 'pg';
   import * as schema from './schema';

   // For Next.js edge runtime, you'd use a different client
   // This is for Node.js runtime
   const pool = new Pool({
   	connectionString: process.env.POSTGRES_URL,
   });

   export const db = drizzle(pool, { schema });
   ```

4. **Create Migration Configuration**
   Create `frontend/drizzle.config.ts`:

   ```typescript
   import type { Config } from 'drizzle-kit';

   export default {
   	schema: './db/schema.ts',
   	out: './db/migrations',
   	driver: 'pg',
   	dbCredentials: {
   		connectionString: process.env.POSTGRES_URL || '',
   	},
   } satisfies Config;
   ```

5. **Add Migration Scripts to package.json**

   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "next lint",
     "db:generate": "drizzle-kit generate:pg",
     "db:push": "drizzle-kit push:pg",
     "db:studio": "drizzle-kit studio",
     "db:seed": "tsx db/seed.ts"
   }
   ```

6. **Generate Migrations**
   ```bash
   npm run db:generate
   ```

### 3. Create Seed Script and API Layer (2 days)

1. **Create Database Seed Script**
   Create `frontend/db/seed.ts`:

   ```typescript
   import { db } from './index';
   import { suspects, contexts, secrets, storyContext } from './schema';
   import {
   	suspects as suspectData,
   	storyContext as storyData,
   } from '../data/suspects';

   async function main() {
   	console.log('Seeding database...');

   	// Clear existing data
   	await db.delete(secrets);
   	await db.delete(contexts);
   	await db.delete(suspects);
   	await db.delete(storyContext);

   	// Insert suspects
   	for (const [id, suspect] of Object.entries(suspectData)) {
   		// Insert suspect
   		await db.insert(suspects).values({
   			id,
   			name: suspect.name,
   			role: suspect.role,
   			description: suspect.description,
   			isGuilty: suspect.isGuilty,
   			gender: suspect.gender,
   		});

   		// Insert context
   		await db.insert(contexts).values({
   			background: suspect.context.background,
   			personality: suspect.context.personality,
   			alibi: suspect.context.alibi,
   			suspectId: id,
   		});

   		// Insert secrets
   		for (const content of suspect.context.secrets) {
   			await db.insert(secrets).values({
   				content,
   				suspectId: id,
   			});
   		}
   	}

   	// Insert story context
   	await db.insert(storyContext).values({
   		id: 'main',
   		title: storyData.title,
   		description: storyData.description,
   		location: storyData.location,
   		victim: storyData.victim,
   		murderWeapon: storyData.murderWeapon,
   	});

   	console.log('Database seeded successfully!');
   }

   main()
   	.catch((e) => {
   		console.error('Error seeding database:', e);
   		process.exit(1);
   	})
   	.finally(() => {
   		process.exit(0);
   	});
   ```

2. **Set Up Next.js API Routes**

   Create `frontend/app/api/suspects/route.ts`:

   ```typescript
   import { NextResponse } from 'next/server';
   import { db } from '@/db';
   import { suspects, contexts, secrets } from '@/db/schema';
   import { eq } from 'drizzle-orm';

   export async function GET() {
   	try {
   		// Fetch all suspects with their contexts and secrets
   		const allSuspects = await db.query.suspects.findMany({
   			with: {
   				context: true,
   				secrets: true,
   			},
   		});

   		// Transform to match current structure
   		const formattedSuspects = allSuspects.reduce((acc, suspect) => {
   			acc[suspect.id] = {
   				id: suspect.id,
   				name: suspect.name,
   				role: suspect.role,
   				description: suspect.description,
   				isGuilty: suspect.isGuilty,
   				gender: suspect.gender,
   				context: {
   					background: suspect.context?.background || '',
   					personality: suspect.context?.personality || '',
   					alibi: suspect.context?.alibi || '',
   					secrets: suspect.secrets.map((s) => s.content),
   				},
   			};
   			return acc;
   		}, {} as Record<string, any>);

   		return NextResponse.json(formattedSuspects);
   	} catch (error) {
   		console.error('Error fetching suspects:', error);
   		return NextResponse.json(
   			{ error: 'Failed to fetch suspects' },
   			{ status: 500 }
   		);
   	}
   }
   ```

   Create `frontend/app/api/suspects/[id]/route.ts`:

   ```typescript
   import { NextResponse } from 'next/server';
   import { db } from '@/db';
   import { eq } from 'drizzle-orm';

   export async function GET(
   	request: Request,
   	{ params }: { params: { id: string } }
   ) {
   	try {
   		const suspectId = params.id;

   		const suspect = await db.query.suspects.findFirst({
   			where: eq(suspects.id, suspectId),
   			with: {
   				context: true,
   				secrets: true,
   			},
   		});

   		if (!suspect) {
   			return NextResponse.json(
   				{ error: 'Suspect not found' },
   				{ status: 404 }
   			);
   		}

   		const formattedSuspect = {
   			id: suspect.id,
   			name: suspect.name,
   			role: suspect.role,
   			description: suspect.description,
   			isGuilty: suspect.isGuilty,
   			gender: suspect.gender,
   			context: {
   				background: suspect.context?.background || '',
   				personality: suspect.context?.personality || '',
   				alibi: suspect.context?.alibi || '',
   				secrets: suspect.secrets.map((s) => s.content),
   			},
   		};

   		return NextResponse.json(formattedSuspect);
   	} catch (error) {
   		console.error(`Error fetching suspect ${params.id}:`, error);
   		return NextResponse.json(
   			{ error: 'Failed to fetch suspect' },
   			{ status: 500 }
   		);
   	}
   }
   ```

   Create `frontend/app/api/story/route.ts`:

   ```typescript
   import { NextResponse } from 'next/server';
   import { db } from '@/db';
   import { storyContext } from '@/db/schema';
   import { eq } from 'drizzle-orm';

   export async function GET() {
   	try {
   		const story = await db.query.storyContext.findFirst({
   			where: eq(storyContext.id, 'main'),
   		});

   		if (!story) {
   			return NextResponse.json(
   				{ error: 'Story not found' },
   				{ status: 404 }
   			);
   		}

   		return NextResponse.json(story);
   	} catch (error) {
   		console.error('Error fetching story:', error);
   		return NextResponse.json(
   			{ error: 'Failed to fetch story' },
   			{ status: 500 }
   		);
   	}
   }
   ```

### 4. Update Frontend Components (1-2 days)

1. **Create Data Fetching Hooks**

   Create `frontend/hooks/useData.ts`:

   ```typescript
   import { useEffect, useState } from 'react';

   export function useSuspects() {
   	const [suspects, setSuspects] = useState<Record<string, any>>({});
   	const [loading, setLoading] = useState(true);
   	const [error, setError] = useState<Error | null>(null);

   	useEffect(() => {
   		async function fetchSuspects() {
   			try {
   				const response = await fetch('/api/suspects');
   				if (!response.ok) throw new Error('Failed to fetch suspects');
   				const data = await response.json();
   				setSuspects(data);
   			} catch (err) {
   				setError(err instanceof Error ? err : new Error(String(err)));
   			} finally {
   				setLoading(false);
   			}
   		}

   		fetchSuspects();
   	}, []);

   	return { suspects, loading, error };
   }

   export function useStoryContext() {
   	const [storyContext, setStoryContext] = useState<any>(null);
   	const [loading, setLoading] = useState(true);
   	const [error, setError] = useState<Error | null>(null);

   	useEffect(() => {
   		async function fetchStoryContext() {
   			try {
   				const response = await fetch('/api/story');
   				if (!response.ok) throw new Error('Failed to fetch story context');
   				const data = await response.json();
   				setStoryContext(data);
   			} catch (err) {
   				setError(err instanceof Error ? err : new Error(String(err)));
   			} finally {
   				setLoading(false);
   			}
   		}

   		fetchStoryContext();
   	}, []);

   	return { storyContext, loading, error };
   }
   ```

2. **Update Components to Use Data Hooks**

   - Replace static imports from `suspects.ts` with hook calls
   - Add loading states to affected components

   Example component update:

   ```typescript
   import { useSuspects } from '@/hooks/useData';

   export default function SuspectList() {
   	const { suspects, loading, error } = useSuspects();

   	if (loading) return <div>Loading suspects...</div>;
   	if (error) return <div>Error loading suspects: {error.message}</div>;
   	if (!suspects || Object.keys(suspects).length === 0)
   		return <div>No suspects found</div>;

   	return (
   		<div>
   			{Object.values(suspects).map((suspect: any) => (
   				<SuspectCard key={suspect.id} suspect={suspect} />
   			))}
   		</div>
   	);
   }
   ```

### 5. Update Python Agent (1-2 days)

1. **Add HTTP Client Dependency**

   ```bash
   cd agent
   pip install requests
   ```

2. **Create API Client in Python**

   Create `agent/api_client.py`:

   ```python
   import os
   import requests
   import logging
   import json
   from typing import Dict, Any, Tuple

   logger = logging.getLogger("api-client")

   class APIClient:
       def __init__(self):
           # Get base URL from env vars or use localhost
           self.base_url = os.environ.get('API_BASE_URL', 'http://localhost:3000/api')
           self.cache = {}
           self.cache_ttl = 300  # 5 minutes

       def get_suspects(self) -> Dict[str, Any]:
           try:
               response = requests.get(f"{self.base_url}/suspects")
               response.raise_for_status()
               data = response.json()
               self.cache['suspects'] = data
               return data
           except Exception as e:
               logger.error(f"Error fetching suspects: {e}")
               # Return cached data if available
               if 'suspects' in self.cache:
                   logger.info("Using cached suspect data")
                   return self.cache['suspects']
               # Otherwise return empty dict
               return {}

       def get_story_context(self) -> Dict[str, Any]:
           try:
               response = requests.get(f"{self.base_url}/story")
               response.raise_for_status()
               data = response.json()
               self.cache['story'] = data
               return data
           except Exception as e:
               logger.error(f"Error fetching story context: {e}")
               # Return cached data if available
               if 'story' in self.cache:
                   logger.info("Using cached story data")
                   return self.cache['story']
               # Otherwise return empty dict
               return {}

       def get_suspect_and_story(self) -> Tuple[Dict[str, Any], Dict[str, Any]]:
           suspects = self.get_suspects()
           story = self.get_story_context()
           return suspects, story
   ```

3. **Update `agent.py` to Use API Client**

   ```python
   from api_client import APIClient

   # Initialize API client
   api = APIClient()

   # Fetch suspects data
   def fetch_suspect_data():
       """Fetch suspect data from API"""
       try:
           # Get suspects and story from API
           suspects, story_context = api.get_suspect_and_story()

           if not suspects:
               logger.error("Could not fetch suspect data from API")
               return {}, {}

           logger.info(f"Successfully loaded {len(suspects)} suspects from API")
           return suspects, story_context

       except Exception as e:
           logger.error(f"Error fetching suspect data: {e}")
           return {}, {}
   ```

4. **Update Environment Configuration**
   - Add `API_BASE_URL` to `.env.local`

### 6. Testing and Deployment (1-2 days)

1. **Local Testing**

   - Run database migrations
   - Run seed script: `npm run db:seed`
   - Test frontend with database: `npm run dev`
   - Test Python agent with API

2. **Deployment Configuration**

   - Update deployment scripts for database URL
   - Add database migration step to CI/CD pipeline
   - Ensure environment variables are properly set

3. **Monitoring**
   - Add error logging for database connections
   - Set up basic monitoring for API endpoints

## Migration Strategy

We'll use a phased approach to minimize disruption:

1. **Phase 1: Dual Systems**

   - Keep the current file-based system
   - Implement database and API in parallel
   - Allow system to use API with fallback to files

2. **Phase 2: API Primary**

   - Make API the primary data source
   - Use file parsing as fallback only

3. **Phase 3: API Only**
   - Remove file parsing logic
   - Use API exclusively

## Timeline

- **Total Estimated Time**: 6-9 days
- **Setup & Schema**: 2 days
- **API Layer**: 2 days
- **Frontend Updates**: 1-2 days
- **Python Agent**: 1-2 days
- **Testing & Deployment**: 1-2 days

## How Drizzle Works in Simple Terms

Drizzle ORM works in a few simple steps:

1. **Define Your Tables**: You write TypeScript code that defines your database tables, columns, and relationships
2. **Connect to Database**: Drizzle connects to your Neon Postgres database using the connection string

3. **Query Your Data**: You can then use Drizzle's query builder to:
   - Select data (`db.select().from(suspects)`)
   - Insert data (`db.insert(suspects).values({...})`)
   - Update data (`db.update(suspects).set({...}).where(...)`)
   - Delete data (`db.delete(suspects).where(...)`)
4. **Type Safety**: The TypeScript compiler checks that your queries match your table structure

The beauty of Drizzle is that it gives you a SQL-like experience with full TypeScript type safety.

### Example: Fetching a Suspect

```typescript
// With raw SQL
// SELECT * FROM suspects WHERE id = 'sarah';

// With Drizzle
import { eq } from 'drizzle-orm';
const sarah = await db.query.suspects.findFirst({
	where: eq(suspects.id, 'sarah'),
	with: {
		context: true,
		secrets: true,
	},
});
```

## Future Enhancements

Once the basic migration is complete, we can consider:

1. **Admin Interface**: Create a web UI for managing suspects and story
2. **Analytics**: Track user interactions and session data
3. **User Accounts**: Allow saving progress between sessions
4. **Multiple Murder Scenarios**: Support different storylines
5. **Content Management System**: Non-technical editing of game content
