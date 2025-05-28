import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: process.env.DATABASE_URI!,
  },
};