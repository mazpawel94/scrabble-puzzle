import { asc, eq } from "drizzle-orm";
import { db } from "../client";
import { diagrams } from "../schema";

export type Diagram = typeof diagrams.$inferSelect;
export type NewDiagram = typeof diagrams.$inferInsert;

export async function getAllDiagrams(): Promise<Diagram[]> {
  return db.select().from(diagrams).orderBy(asc(diagrams.createdAt));
}

export async function upsertDiagrams(items: NewDiagram[]): Promise<void> {
  if (items.length === 0) return;

  await db
    .insert(diagrams)
    .values(items)
    .onConflictDoUpdate({
      target: diagrams.id,
      set: {
        letters: diagrams.letters,
        isPublic: diagrams.isPublic,
        words: diagrams.words,
        solution: diagrams.solution,
        level: diagrams.level,
        createdAt: diagrams.createdAt,
      },
    });
}

export async function deleteDiagram(id: string): Promise<void> {
  await db.delete(diagrams).where(eq(diagrams.id, id));
}
