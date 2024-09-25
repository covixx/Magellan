import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { insertaccountschema, todo } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq, inArray, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
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
            content: todo.content,
            createdat: todo.createdAt,
        })
        .from(todo)
        .where(eq(todo.userId, auth.userId));
    return c.json({ data });
    })
    .post("/", 
        clerkMiddleware(),
        zValidator("json", insertaccountschema.pick({
            content: true,
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
    .patch("/", 
        clerkMiddleware(),
        zValidator("json", z.object({
            id: z.string(),
            content: z.string(),
        })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");
            if (!auth?.userId){
                return c.json({error: "Unauthorized"}, 401);
            }
            const [data] = await db
                .update(todo)
                .set({ content: values.content })
                .where(
                    and(
                        eq(todo.id, values.id),
                        eq(todo.userId, auth.userId)
                    )
                )
                .returning();
            return c.json(data);
        }
    )
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