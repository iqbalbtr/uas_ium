import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-serverless";

const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!, { schema });

export default db;