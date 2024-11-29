import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const queryClient = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
const db = drizzle({ client: queryClient, schema });

export default db;
