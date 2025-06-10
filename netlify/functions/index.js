const Razorpay = require("razorpay");

const allowedOrigins = [
  "https://photobooth-zm5n.onrender.com",
  "http://localhost:4200"
];

exports.handler = async (request) => {
  const origin = request.headers.origin;

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
  };

  // ✅ Handle preflight OPTIONS request
  if (request.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "Preflight OK"
    };
  }

  // ✅ Initialize Razorpay
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  const requestBody = JSON.parse(request.body || "{}");
  const {
    type,
    name,
    usage,
    fixed_amount,
    payment_amount,
    description
  } = requestBody;
  try {
    const qrCode = await instance.qrCode.create({
      type,
      name,
      usage,
      fixed_amount,
      payment_amount,
      description
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(qrCode)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
