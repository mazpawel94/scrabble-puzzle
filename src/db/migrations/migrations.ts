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
  },
};
