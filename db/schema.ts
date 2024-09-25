import { date } from "drizzle-orm/mysql-core";
import { timestamp } from "drizzle-orm/pg-core";
import {z} from "zod";
import { json } from "drizzle-orm/pg-core";
import { integer, pgTable, text, serial, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const todo = pgTable("todo", {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    content: text("content").notNull(),
    userId: text("user_id").notNull(),
});

export const insertaccountschema = createInsertSchema(todo);

export const nutrition = pgTable("nutrition", {
    date: timestamp("date", {mode: "date"}).notNull(),
    id: text("id").primaryKey(),
    food: text("food").notNull(),
    calories: integer("calories").notNull(),
    carbs: integer("carbs").notNull(),
    proteins: integer("proteins").notNull(),    
    fats: integer("fats").notNull(),
});

export const insertnutritionschema = createInsertSchema(nutrition);

export const gym = pgTable("gym", {
    date: timestamp("date", {mode: "date"}).notNull(),
    id: text("id").primaryKey(),
    exercise: text("exercise").notNull(),
    sets: integer("sets").notNull(),
    reps: integer("reps").notNull(),
    weight: integer("weights").notNull(),
    muscle: text("muscle").notNull(),    
});

export const insertgymschema = createInsertSchema(gym);

export const lockingin = pgTable("lockingin", {
    date: timestamp("date", {mode: "date"}).notNull(),
    id: text("id").primaryKey(),
    focustime: integer("focustime"),
});

export const insertlockingschema = createInsertSchema(lockingin);

export const habits = pgTable("habits", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
    days: json("days").default([]).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
export const inserthabitsschema = createInsertSchema(habits);

export const userSettings = pgTable('user_settings', {
    userId: text('user_id').primaryKey(),
    spotifyLink: text('spotify_link'),
    height: integer('height'),
    weight: integer('weight'),
    goal: text('goal'),
    workoutDays: integer('workout_days'),
    age: integer('age'),
    maxCalories: integer('max_calories'),
  });

export const insertsettingschema = createInsertSchema(userSettings);