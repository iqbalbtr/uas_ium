export const config = {
    runtime: 'edge',
};

import * as schema from "./schema";
import { drizzle, NeonClient, NeonDatabase } from "drizzle-orm/neon-serverless";

let db: NeonDatabase<typeof schema> & {
    $client: NeonClient;
} | null = null;

if (!db) {
    db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!, { schema });
}

export default db as (NeonDatabase<typeof schema> & {
    $client: NeonClient;
});