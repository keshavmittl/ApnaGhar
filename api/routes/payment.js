import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

// Created lazily on first request so a missing key config cannot crash the
// whole API at boot — the route simply reports the problem instead.
let razorpayClient = null;
const getRazorpay = () => {
  if (razorpayClient) return razorpayClient;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpayClient;
};

router.post("/create-order", async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  // Reject non-numeric amounts before the money math — `amount * 100` on a
  // string (or NaN) would otherwise produce a broken Razorpay order.
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: "A valid positive amount is required" });
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    return res
      .status(503)
      .json({ error: "Payments are not configured on this server" });
  }

  try {
    const options = {
      amount: Math.round(numericAmount * 100),
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

export default router;