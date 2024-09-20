import { Hono } from "hono";
import { z } from "zod";
import { db }  from "@/db/drizzle";
import { insertgymschema, gym } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { error } from "console";
import { eq, inArray, and, desc, gte, lte } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { auth } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { subDays, parse } from "date-fns";
import { start } from "repl";

const app = new Hono()
    .get("/", 
        clerkMiddleware(),
        async (c) => {
        
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
        
    return c.json({ data });
    })
    .post("/", 
        clerkMiddleware(),
        zValidator("json", insertgymschema.omit({
            id: true,
            date: true,
        })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");
            if (!auth?.userId){
                return c.json({error: "Unauthorized"}, 401);
            }
            const [data] = await db.insert(gym).values({
                id: createId(),
                date: new Date(), 
                ...values,
            }).returning({
                date: gym.date,
                id: gym.id,
                exercise: gym.exercise,
                sets: gym.sets,
                reps: gym.reps,
                weight: gym.weight,
                muscle: gym.muscle,
            });
            return c.json({ data }); // <--- Return the inserted data
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
            if(!auth?.userId){
                return c.json({
                    error: "Unauthorized"}, 401);
                
            }
            const data = await db
                .delete(gym)
                .where(
                    and(eq(gym.id, auth.userId),
                    inArray(gym.id, value.id)
                    )
            )
            .returning({
                id: gym.id,
            });
            return c.json({data});
        },

    )
   

export default app;