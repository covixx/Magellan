import { Hono } from "hono";
import { z } from "zod";
import { db }  from "@/db/drizzle";
import { insertaccountschema, todo } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { error } from "console";
import { eq, inArray, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { auth } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
const app = new Hono()
    .get("/", 
        clerkMiddleware(),
        async (c) => {
        const auth = getAuth(c);
        if(!auth?.userId) {
            return c.json({error: "Unauthorized"}, 401);
        }
        const data = await db
        .select({
            id: todo.id,
            name: todo.name,
        })
        .from(todo)
        .where(eq(todo.userId, auth.userId));
    return c.json({ data });
    })
    .post("/", 
        clerkMiddleware(),
        zValidator("json", insertaccountschema.pick({
            name: true,
        })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");
            if (!auth?.userId){
                return c.json({error: "Unauthorized"}, 401);
            }
            const [data] = await db.insert(todo).values({
                id: createId(), 
                userId: auth.userId,
                ...values,
            }).returning();
        return c.json({});
    })
    .post("/deletetask",
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
                .delete(todo)
                .where(
                    and(eq(todo.userId, auth.userId),
                    inArray(todo.id, value.id)
                    )
            )
            .returning({
                id: todo.id,
            });
            return c.json({data});
        },

    )
   

export default app;