import { Hono } from "hono";
import { z } from "zod";
import { db }  from "@/db/drizzle";
import { insertlockingschema, gym, lockingin } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { error } from "console";
import { eq, inArray, and, desc, gte, lte } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { auth } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { subDays, parse } from "date-fns";
import { start } from "repl";

const app = new Hono()

export default app;