import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const globalForDb = globalThis as unknown as {
  michaelPaperDb?: ReturnType<typeof postgres>;
};

export const sql =
  globalForDb.michaelPaperDb ??
  postgres(connectionString, {
    max: process.env.NODE_ENV === "development" ? 5 : 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.michaelPaperDb = sql;
}
