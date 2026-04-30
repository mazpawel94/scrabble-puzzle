export const migrations = {
  journal: {
    version: "5",
    dialect: "sqlite",
    entries: [
      {
        idx: 0,
        version: "5",
        when: 1700000000000,
        tag: "0000_elite_captain_marvel",
        breakpoints: true,
      },
      {
        idx: 1,
        version: "5",
        when: 1700000000001,
        tag: "0001_outbox",
        breakpoints: true,
      },
      {
        idx: 2,
        version: "5",
        when: 1700000000002,
        tag: "0002_add_liked_tags",
        breakpoints: true,
      },
    ],
  },
  migrations: {
    m0000: `CREATE TABLE "diagrams" (
      "id" text PRIMARY KEY NOT NULL,
      "letters" text NOT NULL,
      "is_public" text NOT NULL,
      "words" text NOT NULL,
      "solution" text NOT NULL,
      "level" integer,
      "hints" integer DEFAULT 0,
      "attempts" integer DEFAULT 0,
      "solved" text DEFAULT 'false',
      "passed" text,
      "solved_at" text,
      "created_at" text NOT NULL
    )`,
    m0001: `CREATE TABLE "outbox" (
    "id" text PRIMARY KEY NOT NULL,
    "endpoint" text NOT NULL,
    "method" text NOT NULL,
    "body" text NOT NULL,
    "created_at" text NOT NULL
    )`,
    m0002: `ALTER TABLE "diagrams" ADD COLUMN "is_liked" integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "diagrams" ADD COLUMN "tags" text NOT NULL DEFAULT '[]'`,
  },
};
