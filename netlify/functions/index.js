const Razorpay = require('razorpay');
const allowedOrigins = [
  "https://photobooth-zm5n.onrender.com",
  "http://localhost:4200"
];
exports.handler = async (event) => {
  const origin = event.headers.origin;
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
  };
  if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No request body received' }),
      };
    }
  // ✅ Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "Preflight OK"
    };
  }
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  try {
    const body = JSON.parse(event.body);
     const qrPayload = {
      type: body.type,
      name: body.name,
      usage: body.usage,
      fixed_amount: body.fixed_amount,
      payment_amount: body.payment_amount,
      description: body.description,
    };
    const qrCode = await instance.qrCode.create(qrPayload);

    return {
     statusCode: 200,
      headers: corsHeaders,
     body: JSON.stringify(qrCode),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
