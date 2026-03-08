// apps/server/src/index.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { topicsRouter } from "./routes/topics";
import { conceptsRouter } from "./routes/concepts";
import { searchRouter } from "./routes/search";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/topics", topicsRouter);
app.use("/api/concepts", conceptsRouter);
app.use("/api/search", searchRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Mobile API ready at http://localhost:${PORT}/api`);
});
