import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendSMS = async (to, message) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_SMSTO_SEND_API,
      {
        message: message,
        to,
        sender_id: process.env.SMSTO_SENDER_ID || "SMSInfo",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SMSTO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || "SMS.to sending failed.");
    }

    console.log("✅ SMS sent via SMS.to:", data);
    return data;
  } catch (error) {
    console.error("❌ SMS.to API error:", error.message);
    throw error;
  }
};
