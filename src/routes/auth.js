import express from "express";
import { db } from "../services/firebase.js";
import { sendSMS } from "../services/esms.js";
import { generateAccessCode } from "../utils/generateAccessCode.js";
import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";

const router = express.Router();

router.post(`/create-code`, async (req, res) => {
  const { phoneNumber } = req.body;
  const accessCode = generateAccessCode();
  const message = `your access code is: ${accessCode}. It's only valid within 5 minutes`;
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

  try {
    await sendSMS(phoneNumber, message);

    // Only save to Firestore if SMS succeeded
    await db
      .collection("users")
      .doc(phoneNumber)
      .set({ accessCode, expiresAt }, { merge: true });

    console.log(`🔐 DEV ONLY: OTP for ${phoneNumber} is ${accessCode}`);
    // return successResponse({
    //   res,
    //   status: 200,
    //   message: "OTP sent successful",
    // });
    res.json({ success: true });
  } catch (error) {
    return errorResponse({
      res,
      status: 500,
      message: `Send access code error: ${error.message}`,
    });
  }
});

router.post(`/validate-code`, async (req, res) => {
  const { phoneNumber, accessCode } = req.body;

  try {
    const userDoc = await db.collection("users").doc(phoneNumber).get();

    if (!userDoc.exists) {
      return errorResponse({
        res,
        status: 404,
        message: "Phone number not found",
      });
    }

    const userData = userDoc.data();

    if (userData.accessCode !== accessCode) {
      return errorResponse({
        res,
        status: 401,
        message: "Invalid access code",
      });
    }

    if (Date.now() > userData.expiresAt) {
      return errorResponse({
        res,
        status: 401,
        message: "Access code expired",
      });
    }
    // Clear access code once validated
    await db
      .collection("users")
      .doc(phoneNumber)
      .update({ accessCode: "", expiresAt: "" });

    res.json({ success: true });
  } catch (error) {
    return errorResponse({
      res,
      status: 500,
      message: `Validation error: ${error.message}`,
    });
  }
});
export default router;
