import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware, requireAuth } from "./middleware/auth.js";
import franchiseRoutes from "./routes/franchises.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4173",
    ],
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
