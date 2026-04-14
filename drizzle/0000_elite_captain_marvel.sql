CREATE TABLE `diagrams` (
	`id` text PRIMARY KEY NOT NULL,
	`letters` text NOT NULL,
	`is_public` text NOT NULL,
	`words` text NOT NULL,
	`solution` text NOT NULL,
	`level` integer,
	`hints` integer DEFAULT 0,
	`attempts` integer DEFAULT 0,
	`solved` text DEFAULT 'false',
	`passed` text,
	`solved_at` text,
	`created_at` text NOT NULL
);
