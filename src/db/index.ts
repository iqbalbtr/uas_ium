import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

const queryClient = new Pool({
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL!,
    ssl: process.env.NODE_ENV == "production",
});
const db = drizzle({ client: queryClient, schema });

export default db;