import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendSMS = async (to, message) => {
  try {
    if (!to || !message) throw new Error("Phone number or message missing");

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
