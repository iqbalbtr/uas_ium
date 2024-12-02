import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neon } from "@neondatabase/serverless";

// const queryClient = new Pool({
//     connectionString: process.env.NEXT_PUBLIC_DATABASE_URL!,
//     ssl: process.env.NODE_ENV == "production",
    
// });
// const queryClient = neon(process.env.NEXT_PUBLIC_DATABASE_URL!)
const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!,{ schema });

export default db;