const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_test_JI7865FlIMHDoT",
  key_secret: "LG7aF886cTeY8JDYykN9eG2c"
});

app.post("/create-qr", async (req, res) => {
  try {
    const qr = await razorpay.qrCode.create({
      type: "upi_qr", // or bharat_qr
      name: "Photo Booth Payment",
      usage: "single_use", // or multiple_use
      fixed_amount: true,
      payment_amount: 50000, // in paise = ₹500
      description: "PhotoBooth Payment",
      customer_id: null,
      close_by: Math.floor(Date.now() / 1000) + 600, // QR expires in 10 mins
    });

    res.json(qr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "QR code creation failed" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("QR Server running");
});
