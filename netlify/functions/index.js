const Razorpay = require('razorpay');

exports.handler = async (event) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  try {
    const qrCode = await instance.qrCode.create({
      type: "upi_qr",
      name: "Charan's Store",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: 5000, // ₹50.00
      description: "Test QR Code"
    });

    return {
      statusCode: 200,
      body: JSON.stringify(qrCode)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
