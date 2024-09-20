import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { access } from 'fs';
import * as schema from "./schema";
export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema});
