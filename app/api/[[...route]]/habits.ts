import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { habits } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq, and, desc } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

const insertHabitsSchema = z.object({
  name: z.string(),
});

const updateHabitSchema = z.object({
  date: z.string(),
});

interface HabitDay {
  date: string;
  done: boolean;
}

interface Habit {
  id: string;
  name: string;
  userId: string;
  days: HabitDay[];
  createdAt: Date;
}

const app = new Hono()
  .post("/",
    clerkMiddleware(),
    zValidator("json", insertHabitsSchema),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const { name } = c.req.valid("json");

      const newId = createId();

      const [habit] = await db.insert(habits).values({
        id: newId,
        name,
        userId: auth.userId,
        days: [],
      }).returning();

      return c.json(habit);
    }
  )
  .get("/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const data = await db
        .select()
        .from(habits)
        .where(eq(habits.userId, auth.userId))
        .orderBy(desc(habits.createdAt));

      return c.json(data);
    }
  )
  .patch("/:id",
    clerkMiddleware(),
    zValidator("json", updateHabitSchema),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const habitId = c.req.param('id');
      const { date } = c.req.valid("json");

      const [habit] = await db
        .select()
        .from(habits)
        .where(and(
          eq(habits.id, habitId),
          eq(habits.userId, auth.userId)
        ));

      if (!habit) {
        return c.json({ error: "Habit not found" }, 404);
      }

      const typedHabit = habit as unknown as Habit; // Type assertion
      let updatedDays = [...typedHabit.days];
      const existingDayIndex = updatedDays.findIndex((day) => day.date === date);

      if (existingDayIndex !== -1) {
        // Toggle the existing day
        updatedDays[existingDayIndex].done = !updatedDays[existingDayIndex].done;
      } else {
        // Add a new day
        updatedDays.push({ date, done: true });
      }

      const [updatedHabit] = await db
        .update(habits)
        .set({ days: updatedDays })
        .where(eq(habits.id, habitId))
        .returning();

      return c.json(updatedHabit);
    }
  );

export default app;