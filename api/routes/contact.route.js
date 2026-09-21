import express from "express";
import rateLimit from "express-rate-limit";
import { submitContact } from "../controllers/contact.controller.js";

const router = express.Router();

// Public endpoint, so keep a tight per-IP cap: five submissions per ten
// minutes is plenty for genuine enquiries and throttles form spam hard.
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message:
      "You've sent quite a few messages — please wait a few minutes before trying again.",
  },
});

router.post("/", contactLimiter, submitContact);

export default router;
