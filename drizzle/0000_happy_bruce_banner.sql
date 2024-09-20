CREATE TABLE IF NOT EXISTS "gym" (
	"date" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"exercise" text NOT NULL,
	"sets" integer NOT NULL,
	"reps" integer NOT NULL,
	"weights" integer NOT NULL,
	"muscle" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lockingin" (
	"date" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"focustime" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrition" (
	"date" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"food" text NOT NULL,
	"calories" integer NOT NULL,
	"carbs" integer NOT NULL,
	"proteins" integer NOT NULL,
	"fats" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo" (
	"id" text PRIMARY KEY NOT NULL,
	"plaid_id" text,
	"name" text NOT NULL,
	"user_id" text NOT NULL
);
