import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import https from "https";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";
import passport from "./config/passport.js";
import { printServiceStatus } from "./utils/serviceChecker.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// ✅ تحميل الشهادات لتفعيل HTTPS
const sslOptions = {
  key: fs.readFileSync(join(__dirname, "sslOptions", "127.0.0.1+2-key.pem")),
  cert: fs.readFileSync(join(__dirname, "sslOptions", "127.0.0.1+2.pem")),
};

// ⚙️ Middleware خاص بالبوتات
app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  if (userAgent.includes("Lighthouse") || userAgent.includes("Googlebot")) {
    return next();
  }
  next();
});

app.set("trust proxy", 1);
connectDB();
app.use(cookieParser());

const allowedOrigins = [
  "https://medrxhelper.netlify.app",
  "https://localhost:3001",
  "https://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://localhost:3002",
  "http://localhost:3002",
  "https://localhost:5173",
  "https://appzajel1.netlify.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("🚫 Access from this source is not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => (req.user ? 10000 : 1000),
  message: "🚨 The maximum request limit has been exceeded, try again later.",
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// إعداد session middleware لـ Passport (مطلوب لـ Google OAuth)
import session from "express-session";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 🧭 Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/favorites", favoritesRoutes);

// ✅ إنشاء السيرفر باستخدام HTTPS
const server = https.createServer(sslOptions, app);

// 🚀 تشغيل السيرفر
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`🚀 HTTPS Server running on https://localhost:${PORT}`);
  printServiceStatus();
});
