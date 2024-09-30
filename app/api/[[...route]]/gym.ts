import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { insertgymschema, gym } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq, inArray, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
    .get("/", 
        clerkMiddleware(),
        async (c) => {
        const auth = getAuth(c);
        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const data = await db
        .select({
            id: gym.id,
            exercise: gym.exercise,
            sets: gym.sets,
            reps: gym.reps,
            weight: gym.weight,
            muscle: gym.muscle,
            date: gym.date,
        })
        .from(gym)
        .where(eq(gym.userId, auth.userId));
        
    return c.json({ data });
    })
    .post("/", 
        clerkMiddleware(),
        zValidator("json", insertgymschema.omit({
            id: true,
            date: true,
            userId: true, // Add this line to omit userId from validation
        })),
        async (c) => {
            try {
                const auth = getAuth(c);
                const values = c.req.valid("json");
                if (!auth?.userId){
                    return c.json({error: "Unauthorized"}, 401);
                }
                const [data] = await db.insert(gym).values({
                    id: createId(),
                    date: new Date(), 
                    userId: auth.userId, // Add this line
                    ...values,
                }).returning({
                    date: gym.date,
                    id: gym.id,
                    exercise: gym.exercise,
                    sets: gym.sets,
                    reps: gym.reps,
                    weight: gym.weight,
                    muscle: gym.muscle,
                    userId: gym.userId, // Add this line if you want to return the userId
                });
                return c.json({ data });
            } catch (error:unknown) {
                console.error("Error in POST /gym:", error);
                if (error instanceof Error) {
                    return c.json({ error: "Internal Server Error", details: error.message }, 500);
                  } else {
                    return c.json({ error: "Internal Server Error", details: "An unknown error occurred" }, 500);
                  }
            }
        }
    )
    .post("/deletemeal",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                id: z.array(z.string()),
            }),
        ),
        async (c) => {
            const auth = getAuth(c);
            const value = c.req.valid("json");
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            const data = await db
                .delete(gym)
                .where(
                    and(
                        eq(gym.userId, auth.userId),
                        inArray(gym.id, value.id)
                    )
                )
                .returning({
                    id: gym.id,
                });
            return c.json({ data });
        },
    )

export default app;