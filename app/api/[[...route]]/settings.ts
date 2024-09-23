import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { userSettings } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { getAuth } from "@hono/clerk-auth";

const app = new Hono();

const settingsSchema = z.object({
  spotifyLink: z.string().url().optional(),
  height: z.number().positive(),
  weight: z.number().positive(),
  goal: z.enum(['mildWeightGain', 'weightLoss']),
  workoutDays: z.number().min(0).max(7),
  age: z.number().positive(),
});

app.get('/', async (c) => {
  const auth = getAuth(c);
  if (!auth) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const userId = auth.userId;
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const settings = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).execute();
  return c.json(settings[0] || {});
});

app.post('/', zValidator('json', settingsSchema), async (c) => {
  const auth = getAuth(c);
  if (!auth) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const userId = auth.userId;
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { spotifyLink, height, weight, goal, workoutDays, age } = c.req.valid('json');

  const bmr = calculateBMR(weight, height, age);
  const tdee = calculateTDEE(bmr, workoutDays);
  const maxCalories = calculateMaxCalories(tdee, goal);

  const newSettings = {
    userId,
    spotifyLink,
    height,
    weight,
    goal,
    workoutDays,
    age,
    maxCalories,
  };

  await db.insert(userSettings).values(newSettings).onConflictDoUpdate({
    target: userSettings.userId,
    set: newSettings,
  });

  return c.json(newSettings);
});
function calculateBMR(weight: number, height: number, age: number): number {
  // Mifflin-St Jeor Equation
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

function calculateTDEE(bmr: number, workoutDays: number): number {
  // Activity multiplier based on workout days
  const activityMultiplier = 1.2 + (workoutDays * 0.05);
  return bmr * activityMultiplier;
}

function calculateMaxCalories(tdee: number, goal: string): number {
  switch (goal) {
    case 'mildWeightGain':
      return tdee + 300;
    case 'weightLoss':
      return tdee - 500;
    default:
      return tdee;
  }
}

export default app;