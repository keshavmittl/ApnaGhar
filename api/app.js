import express from "express";
import dotenv from "dotenv";
dotenv.config();

import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import paymentRoutes from "./routes/payment.js";
import contactRoute from "./routes/contact.route.js";

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const clientOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (clientOrigins.includes(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

// Parse JSON bodies and auth cookies before requests hit the route handlers.
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      if (clientOrigins.length === 0 || isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin is not allowed."));
    },
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok", service: "api" });
});

// Keep route prefixes grouped by feature so the API stays easy to scan.
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoute);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
