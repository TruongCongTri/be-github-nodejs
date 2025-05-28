import dotenv from "dotenv";
dotenv.config();

import { sendSMS } from "../services/vonage.js";

(async () => {
  try {
    const to = process.env.TEST_PHONE_NUMBER; // e.g., 8490xxxxxxx
    const response = await sendSMS(
      to,
      "✅ Vonage SMS test from Node.js backend"
    );
    console.log("Response:", response);
  } catch (err) {
    console.error("❌ Vonage test failed:", err.message || err);
  }
})();


// node src/tests/test-vonage.js