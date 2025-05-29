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

router.post(
  `/create-code`,
  validateSchema(createCodeSchema),
  createAccessCodeController
);

router.post(
  `/validate-code`,
  validateSchema(validateCodeSchema),
  validateAccessCodeController
);
export default router;
