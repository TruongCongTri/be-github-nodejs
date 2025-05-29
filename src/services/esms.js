import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Send SMS using ESMS.vn provider
 *
 * @function sendSMS
 * @param {string} to - Recipient phone number in international format (e.g., 84123456789)
 * @param {string} message - SMS content to be sent
 *
 * @returns {Promise<Object>} ESMS API response if success
 *
 * @throws {Error} Throws if request fails or ESMS returns error code
 */
export const sendSMS = async (to, message) => {
  try {
    if (!to) throw new Error("Phone number missing");

    if (!message) throw new Error("Message missing");
    const payload = {
      ApiKey: process.env.ESMS_API_KEY,
      Content: message,
      Phone: to,
      SecretKey: process.env.ESMS_SECRET_KEY,
      Brandname: process.env.ESMS_BRAND_NAME || "",
      SmsType: process.env.ESMS_SMS_TYPE || "1",
      Sandbox: process.env.ESMS_SANDBOX === "true" ? 1 : 0,
    };

    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_ESMS_API,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data.CodeResult !== "100") {
      throw new Error(`ESMS Error: ${data.ErrorMessage || "Unknown error"}`);
    }

    console.log("✅ SMS sent via ESMS.vn:", data);
    return data;
  } catch (err) {
    console.error("❌ ESMS API error:", err.message);
    throw err;
  }
};
