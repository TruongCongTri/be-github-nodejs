import dotenv from "dotenv";
import { sendSMS } from "../services/esms.js";

dotenv.config();

(async () => {
  try {
    const to = process.env.TEST_PHONE_NUMBER;
    const message = "✅ Hello from ESMS.vn test"; // <== make sure this is NOT empty
    console.log('Message content:', message); // for debugging
    const response = await sendSMS(to, message);
    console.log("Response:", response);
  } catch (err) {
    console.error("❌ SMS test failed:", err.message || err);
  }
})();
// node src/tests/test-esms.js
