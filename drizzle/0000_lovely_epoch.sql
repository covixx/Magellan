CREATE TABLE IF NOT EXISTS "gym" (
	"date" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"exercise" text NOT NULL,
	"sets" integer NOT NULL,
	"reps" integer NOT NULL,
	"weights" integer NOT NULL,
	"muscle" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habits" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"days" json DEFAULT '[]'::json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lockingin" (
	"date" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"focustime" integer,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrition" (
	"date" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"food" text NOT NULL,
	"calories" integer NOT NULL,
	"carbs" integer NOT NULL,
	"proteins" integer NOT NULL,
	"fats" integer NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"content" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"spotify_link" text,
	"height" integer,
	"weight" integer,
	"goal" text,
	"workout_days" integer,
	"age" integer,
	"max_calories" integer
);
