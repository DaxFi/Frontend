import * as functions from "firebase-functions";
import { default as next } from "next";
import { onRequest } from "firebase-functions/v2/https";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, conf: { distDir: ".next" } });
const handle = app.getRequestHandler();

// Optional: run next.prepare() outside handler to warm up the app
const server = onRequest({ region: "us-central1" }, async (req, res) => {
  await app.prepare();
  return handle(req, res);
});

export const nextApp = server;
