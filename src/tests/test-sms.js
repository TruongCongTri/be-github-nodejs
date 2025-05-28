import dotenv from "dotenv";
import { sendSMS } from "../services/sms.js";

dotenv.config();

(async () => {
  try {
    const to = process.env.TEST_PHONE_NUMBER;
    const message = "✅ Test message from SMS.to"; // <== make sure this is NOT empty
    console.log("Message content:", message); // for debugging
    const response = await sendSMS(to, message);
    console.log("Response:", response);
  } catch (err) {
    console.error("❌ SMS,to test failed:", err.message || err);
  }
})();
// node src/tests/test-sms.js
