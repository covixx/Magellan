import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { insertnutritionschema, nutrition } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq, inArray, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
    .get("/", 
        clerkMiddleware(),
        async (c) => {
            try {
                const auth = getAuth(c);
                if (!auth?.userId) {
                    return c.json({ error: "Unauthorized" }, 401);
                }
                const data = await db
                    .select({
                        id: nutrition.id,
                        name: nutrition.food,
                        calories: nutrition.calories,
                        protein: nutrition.proteins,
                        fats: nutrition.fats,
                        carbs: nutrition.carbs,
                        date: nutrition.date,
                    })
                    .from(nutrition)
                    .where(eq(nutrition.userId, auth.userId));
                
                return c.json({ data });
            } catch (error: unknown) {
                console.error("Error in GET /:", error);
                if (error instanceof Error) {
                    return c.json({ error: "Internal Server Error", details: error.message }, 500);
                  } else {
                    return c.json({ error: "Internal Server Error", details: "An unknown error occurred" }, 500);
                  }
            }
        })
    .post("/", 
        clerkMiddleware(),
        zValidator("json", insertnutritionschema.omit({
            id: true,
            date: true,
            userId: true, // Add this line to omit userId from client-side validation
        })),
        async (c) => {
            try {
                const auth = getAuth(c);
                const values = c.req.valid("json");
                if (!auth?.userId) {
                    return c.json({ error: "Unauthorized" }, 401);
                }
                const [data] = await db.insert(nutrition).values({
                    id: createId(),
                    date: new Date(),
                    userId: auth.userId, // Add this line to include the userId
                    ...values,
                }).returning({
                    date: nutrition.date,
                    id: nutrition.id,
                    name: nutrition.food,
                    calories: nutrition.calories,
                    protein: nutrition.proteins,
                    fats: nutrition.fats,
                    carbs: nutrition.carbs,
                    userId: nutrition.userId, // Add this line if you want to return the userId
                });
                return c.json({ data });
            } catch (error: unknown) {
                console.error("Error in POST /:", error);
                if (error instanceof Error) {
                    return c.json({ error: "Internal Server Error", details: error.message }, 500);
                  } else {
                    return c.json({ error: "Internal Server Error", details: "An unknown error occurred" }, 500);
                  }
            }
        })
    .post("/deletemeal",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                id: z.array(z.string()),
            }),
        ),
        async (c) => {
            try {
                const auth = getAuth(c);
                const value = c.req.valid("json");
                if (!auth?.userId) {
                    return c.json({ error: "Unauthorized" }, 401);
                }
                const data = await db
                    .delete(nutrition)
                    .where(
                        and(
                            eq(nutrition.userId, auth.userId),
                            inArray(nutrition.id, value.id)
                        )
                    )
                    .returning({
                        id: nutrition.id,
                    });
                return c.json({ data });
            } catch (error: unknown) {
                console.error("Error in POST /deletemeal:", error);
                if (error instanceof Error) {
                    return c.json({ error: "Internal Server Error", details: error.message }, 500);
                  } else {
                    return c.json({ error: "Internal Server Error", details: "An unknown error occurred" }, 500);
                  }
            }
        })

export default app;