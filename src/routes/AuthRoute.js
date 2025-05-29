/**
 * @file Defines authentication routes including OTP generation and validation.
 * Prefix: /api/auth
 */

import express from "express";

import { validateSchema } from "../middlewares/validateSchema.js";
import {
  createCodeSchema,
  validateCodeSchema,
} from "../validators/authSchema.js";
import {
  createAccessCodeController,
  validateAccessCodeController,
} from "../controllers/AuthController.js";

const router = express.Router();

/**
 * @route POST /api/auth/create-code
 * @desc Generate and send OTP access code
 * @access Public
 */
router.post(
  `/create-code`,
  validateSchema(createCodeSchema),
  createAccessCodeController
);

/**
 * @route POST /api/auth/validate-code
 * @desc Validate the submitted OTP access code for a phone number
 * @access Public
 */
router.post(
  `/validate-code`,
  validateSchema(validateCodeSchema),
  validateAccessCodeController
);
export default router;
