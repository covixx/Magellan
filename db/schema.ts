import { date } from "drizzle-orm/mysql-core";
import { timestamp } from "drizzle-orm/pg-core";
import {z} from "zod";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const todo = pgTable("todo", {
    id: text("id").primaryKey(),
    plaidid: text("plaid_id"),
    name: text("name").notNull(),
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