import { Hono } from "hono";
import { z } from "zod";
import { db }  from "@/db/drizzle";
import { insertnutritionschema, nutrition } from "@/db/schema";
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
            id: nutrition.id,
            name: nutrition.food,
            calories: nutrition.calories,
            protein: nutrition.proteins,
            fats: nutrition.fats,
            carbs: nutrition.carbs,
            date: nutrition.date,
            
        })
        .from(nutrition)
        
    return c.json({ data });
    })
    .post("/", 
        clerkMiddleware(),
        zValidator("json", insertnutritionschema.omit({
            id: true,
            date: true,
        })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");
            if (!auth?.userId){
                return c.json({error: "Unauthorized"}, 401);
            }
            const [data] = await db.insert(nutrition).values({
                id: createId(),
                date: new Date(), 
                ...values,
            }).returning({
                date: nutrition.date,
                id: nutrition.id,
                name: nutrition.food,
                calories: nutrition.calories,
                protein: nutrition.proteins,
                fats: nutrition.fats,
                carbs: nutrition.carbs,
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
                .delete(nutrition)
                .where(
                    and(eq(nutrition.id, auth.userId),
                    inArray(nutrition.id, value.id)
                    )
            )
            .returning({
                id: nutrition.id,
            });
            return c.json({data});
        },

    )
   

export default app;