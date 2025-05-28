import { Vonage } from "@vonage/server-sdk";
import dotenv from "dotenv";
dotenv.config();

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

export const sendSMS = async (to, message) => {
  const from = process.env.VONAGE_FROM_NAME;

  return new Promise((resolve, reject) => {
    vonage.sms.send({ to, from, text: message }, (err, responseData) => {
      if (err) return reject(err);

      const messageData = responseData.messages[0];
      if (messageData.status === "0") {
        console.log("✅ SMS sent successfully:", messageData.messageId);
        resolve(messageData);
      } else {
        console.error("❌ SMS failed:", messageData["error-text"]);
        reject(new Error(messageData["error-text"]));
      }
    });
  });
};
