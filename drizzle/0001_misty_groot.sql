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
