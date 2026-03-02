import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware, requireAuth } from "./middleware/auth.js";
import franchiseRoutes from "./routes/franchises.js";

const app = express();
const PORT = process.env.PORT || 3001;
const LOCAL_ORIGIN_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const ENV_ALLOWED_ORIGINS = new Set(
  (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (LOCAL_ORIGIN_PATTERN.test(origin) || ENV_ALLOWED_ORIGINS.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(clerkMiddleware());

app.use("/api", requireAuth());

app.use(franchiseRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      statusCode: 500,
    });
  }
);

app.listen(PORT, () => {
  console.log(`Express backend running on http://localhost:${PORT}`);
});
