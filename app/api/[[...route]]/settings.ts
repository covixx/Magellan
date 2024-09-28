import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { userSettings } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

const settingsSchema = z.object({
  spotifyLink: z.string().url().optional(),
  height: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  goal: z.enum(["mildWeightGain", "weightLoss", "maintainWeight", "mildWeightLoss", "weightGain"]).optional(),
  workoutDays: z.number().min(0).max(7).optional(),
  age: z.number().min(0).optional(),
});

const app = new Hono()
  .get("/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, auth.userId))
        .limit(1);

      if (data.length === 0) {
        return c.json({ data: null });
      }

      return c.json({ data: data[0] });
    }
  )
  .post("/",
    clerkMiddleware(),
    zValidator("json", settingsSchema),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const existingSettings = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, auth.userId))
        .limit(1);

      let data;

      if (existingSettings.length === 0) {
        [data] = await db.insert(userSettings).values({
 
          userId: auth.userId,
          ...values,
        }).returning();
      } else {
        [data] = await db.update(userSettings)
          .set(values)
          .where(eq(userSettings.userId, auth.userId))
          .returning();
      }

      return c.json({ data });
    }
  );

export default app;