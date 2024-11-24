import * as schema from "./schema"
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client: queryClient,  schema });

export default db;