import { Hono } from "hono";
import { z } from "zod";
import { db }  from "@/db/drizzle";
import { insertlockingschema, gym, lockingin } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { error, time } from "console";
import { eq, inArray, and, desc, gte, lte } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { auth } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { subDays, parse } from "date-fns";
import { start } from "repl";

const app = new Hono()
.post("/", 
    clerkMiddleware(),
    zValidator("json", insertlockingschema.omit({
        id: true,
        date: true,
    })),
    async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json");
        if (!auth?.userId){
            return c.json({error: "Unauthorized"}, 401);
        }
        const [data] = await db.insert(lockingin).values({
            date: new Date(), 
            id: createId(),
            ...values,
        }).returning({
            id: lockingin.id,
            date: lockingin.date,
            focustime: lockingin.focustime,
        });
        return c.json({ data }); // <--- Return the inserted data
    }
)
.get("/", 
    clerkMiddleware(),
    async (c) => {
    const auth = getAuth(c);
    if(!auth?.userId) {
        return c.json({error: "Unauthorized"}, 401);
    }
    const data = await db
    .select({
        date: lockingin.date,
        id: lockingin.id,
        time: lockingin.focustime,
    })
    .from(lockingin)
return c.json({ data });
})
export default app;