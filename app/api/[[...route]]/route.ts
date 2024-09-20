import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import todo from './accounts';
import nutrition from './nutrition';
export const runtime = "edge";
import gym from './gym';
import lockingin from './lockingin';
import settings from './settings';
const app = new Hono().basePath("/api");
const routes = app 
  .route("/tasks", todo)
  .route("/nutrition", nutrition)
  .route("/gym", gym)
  .route("/lockingin", lockingin)
  //breaking other routes .route("/settings", settings);
  
export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;