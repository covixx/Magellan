import { Hono } from "hono";
import { z } from "zod";
import { db }  from "@/db/drizzle";
import { insertlockingschema, gym, lockingin } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
.post("/", 
    clerkMiddleware(),
    zValidator("json", insertlockingschema.omit({
        id: true,
        date: true,
        userId: true, // Add this line to omit userId from client-side validation
    })),
    async (c) => {
        try {
            const auth = getAuth(c);
            const values = c.req.valid("json");
            if (!auth?.userId){
                return c.json({error: "Unauthorized"}, 401);
            }
            const [data] = await db.insert(lockingin).values({
                date: new Date(), 
                id: createId(),
                userId: auth.userId, // Add this line to include the userId
                ...values,
            }).returning({
                id: lockingin.id,
                date: lockingin.date,
                focustime: lockingin.focustime,
                userId: lockingin.userId, // Add this line if you want to return the userId
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
    }
)
.get("/", 
    clerkMiddleware(),
    async (c) => {
    try {
        const auth = getAuth(c);
        if(!auth?.userId) {
            return c.json({error: "Unauthorized"}, 401);
        }
        const data = await db
        .select({
            date: lockingin.date,
            id: lockingin.id,
            time: lockingin.focustime,
            // You can include userId here if you want to return it
            // userId: lockingin.userId,
        })
        .from(lockingin)
        .where(eq(lockingin.userId, auth.userId)); // Add this line to filter by userId

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

export default app;