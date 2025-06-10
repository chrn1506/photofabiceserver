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

   const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "Preflight OK"
    };
  }
  try{
     if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No request body received' }),
      };
    }
    const body = JSON.parse(event.body);
    const qrId = body.qr_id;
    const closeQrCode=await instance.qrCode.close(body.qr_id)

     return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(closeQrCode)
    };
  } catch(error){
     return {
      statusCode: error.response?.status || 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error.response?.data || error.message
      })
    };
  }
};