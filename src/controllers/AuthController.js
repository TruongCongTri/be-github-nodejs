import { db } from "../services/firebase.js";
import { sendSMS } from "../services/esms.js";
import { generateAccessCode } from "../utils/generateAccessCode.js";
import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";
import { EXPIRED_TIME } from "../constant/enum.js";
import { createAccessMessage } from "../helpers/auth/createAccessMessage.js";
import { saveAccessCode } from "../helpers/auth/saveAccessCode.js";
import { getUserAccessCodeData } from "../helpers/auth/getUserAccessCodeData.js";
import { clearUserAccessCode } from "../helpers/auth/clearUserAccessCode.js";

/**
 * Create a new 6-digit access code, send it via SMS, and store it in Firebase.
 *
 * @async
 * @function createAccessCodeController
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.phone_number - The user's phone number in international format
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} JSON response indicating success or failure
 */
export const createAccessCodeController = async (req, res) => {
  const { phone_number } = req.body;

  const accessCode = String(generateAccessCode()).padStart(6, "0");
  const expiresAt = Date.now() + EXPIRED_TIME;
  const message = createAccessMessage(accessCode, `${EXPIRED_TIME / (6 * 1000)}`);
  
  try {
    await sendSMS(phone_number, message);

    // Only save to Firestore if SMS succeeded
    await saveAccessCode(phone_number, accessCode, expiresAt);

    console.log(
      `🔐 DEV ONLY: Access Code for ${phone_number} is ${accessCode}`
    );
    console.log(`🔐 DEV ONLY: SMS - ${message}`);

    return successResponse({
      res,
      statusCode: 200,
      message: `Access code sent to ${phone_number}`,
    });
  } catch (error) {
    console.error(`❌ Send Access code error:`, error.message);
    return errorResponse({
      res,
      statusCode: 500,
      message: `Send Access code error`,
      error: error.message,
    });
  }
};

/**
 * Validate a submitted access code. Clear it if it matches.
 *
 * @async
 * @function validateAccessCodeController
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.phone_number - The user's phone number in international format
 * @param {string} req.body.access_code - The access code to be validated
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} JSON response indicating validation result
 */
export const validateAccessCodeController = async (req, res) => {
  const { phone_number, access_code } = req.body;

  try {
    const userData = await getUserAccessCodeData(phone_number);

    if (!userData) {
      console.log("Phone number not found");
      return errorResponse({
        res,
        statusCode: 404,
        message: "Phone number not found",
      });
    }

    if (userData.accessCode !== access_code) {
      console.log("Invalid access code");
      return errorResponse({
        res,
        statusCode: 401,
        message: "Invalid access code",
      });
    }

    if (Date.now() > userData.expiresAt) {
      console.log("Access code expired");
      return errorResponse({
        res,
        statusCode: 401,
        message: "Access code expired",
      });
    }
    // Clear access code once validated
    await clearUserAccessCode(phone_number);

    return successResponse({ res, statusCode: 200, message: "Code validated" });
  } catch (error) {
    console.error(`❌ Validation error:`, error.message);
    return errorResponse({
      res,
      statusCode: 500,
      message: `Validation error`,
      error: error.message,
    });
  }
};
