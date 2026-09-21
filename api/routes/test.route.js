import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// A tiny protected route that echoes the authenticated user id — useful for
// verifying the JWT cookie flow end to end.
router.get("/", verifyToken, (req, res) => {
  res.status(200).json({ message: "Authenticated", userId: req.userId });
});

export default router;