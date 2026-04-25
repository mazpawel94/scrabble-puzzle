import * as Crypto from "expo-crypto";

import { asc, eq } from "drizzle-orm";
import { db } from "../client";
import { outbox } from "../schema";

export async function enqueue(endpoint: string, method: string, body: object) {
  await db.insert(outbox).values({
    id: Crypto.randomUUID(),
    endpoint,
    method,
    body: JSON.stringify(body),
    createdAt: new Date().toISOString(),
  });
}

export async function getPendingRequests() {
  return db.select().from(outbox).orderBy(asc(outbox.createdAt));
}

export async function removeFromQueue(id: string) {
  await db.delete(outbox).where(eq(outbox.id, id));
}
