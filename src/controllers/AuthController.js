import { db } from "../services/firebase.js";
import { sendSMS } from "../services/esms.js";
import { generateAccessCode } from "../utils/generateAccessCode.js";
import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";
import { EXPIRED_TIME } from "../constant/enum.js";

/**
 * Create a new 6-digit access code, send it via SMS, and store it in Firebase.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.phone_number - The user's phone number in international format
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response indicating success or failure
 */
export const createAccessCodeController = async (req, res) => {
  const { phone_number } = req.body;
  const accessCode = generateAccessCode();
  const message = `Your access code is: ${accessCode}. Only valid within ${
    EXPIRED_TIME / (6 * 1000)
  } minutes`;
  const expiresAt = Date.now() + EXPIRED_TIME;

  try {
    await sendSMS(phone_number, message);

    // Only save to Firestore if SMS succeeded
    await db
      .collection("users")
      .doc(phone_number)
      .set({ accessCode, expiresAt }, { merge: true });

    console.log(
      `🔐 DEV ONLY: Access Code for ${phone_number} is ${accessCode}`
    );
    console.log(
      `🔐 DEV ONLY: Your access code is: ${accessCode}. Only valid within ${
        EXPIRED_TIME / (60 * 1000)
      } minutes`
    );

    return successResponse({
      res,
      status: 200,
      message: `Access code sent to ${phone_number}`,
    });
  } catch (error) {
    console.error(`❌ Send Access code error:`, error.message);
    return errorResponse({
      res,
      status: 500,
      message: `Send Access code error`,
      error: error.message,
    });
  }
};

/**
 * Validate a submitted access code. Clear it if it matches.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.phone_number - The user's phone number in international format
 * @param {string} req.body.access_code - The access code to be validated
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response indicating validation result
 */
export const validateAccessCodeController = async (req, res) => {
  const { phone_number, access_code } = req.body;

  try {
    const userDoc = await db.collection("users").doc(phone_number).get();

    if (!userDoc.exists) {
      return errorResponse({
        res,
        status: 404,
        message: "Phone number not found",
      });
    }

    const userData = userDoc.data();

    if (userData.accessCode !== access_code) {
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
      .doc(phone_number)
      .update({ accessCode: "", expiresAt: "" });

    return successResponse({ res, status: 200, message: "Code validated" });
  } catch (error) {
    console.error(`❌ Validation error:`, error.message);
    return errorResponse({
      res,
      status: 500,
      message: `Validation error`,
      error: error.message,
    });
  }
};
