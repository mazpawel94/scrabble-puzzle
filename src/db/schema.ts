import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const diagrams = sqliteTable("diagrams", {
  id: text("id").primaryKey(),
  letters: text("letters").notNull(),
  isPublic: text("is_public").notNull(),
  words: text("words").notNull(),
  solution: text("solution").notNull(),
  level: integer("level"),
  hints: integer("hints").default(0),
  attempts: integer("attempts").default(0),
  solved: text("solved").default("false"),
  passed: text("passed"),
  solvedAt: text("solved_at"),
  createdAt: text("created_at").notNull(),
});
