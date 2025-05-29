import express from "express";
import { db } from "../services/firebase.js";
import {
  successResponse,
  errorResponse,
} from "../helpers/responses/response.js";
import axios from "axios";
import admin from "firebase-admin";

import { validateSchema } from "../middlewares/validateSchema.js";
import {
  getUserProfileSchema,
  likeGitHubUserSchema,
} from "../validators/userSchema.js";

const router = express.Router();

router.get(
  "/get-user-profile",
  validateSchema(getUserProfileSchema, "query"),
  async (req, res) => {
    const { phone_number } = req.query;

    if (!phone_number)
      return res.status(400).json({ message: "Missing phone_number" });

    const doc = await db.collection("users").doc(phone_number).get();
    if (!doc.exists) return res.status(404).json({ message: "User not found" });

    const { favorite_github_users = [] } = doc.data();

    // Fetch full profile for each GitHub user ID
    const userProfiles = await Promise.all(
      favorite_github_users.map(async (id) => {
        try {
          const res = await axios.get(`https://api.github.com/user/${id}`);
          return res.data;
        } catch {
          return null;
        }
      })
    );

    res.json({
      phone_number,
      favorite_github_users: userProfiles.filter(Boolean),
    });
  }
);

router.post(
  "/like-github-user",
  validateSchema(likeGitHubUserSchema),
  async (req, res) => {
    const { phone_number, github_user_id } = req.body;

    try {
      const userRef = db.collection("users").doc(phone_number);
      await userRef.set(
        {
          favorite_github_users:
            admin.firestore.FieldValue.arrayUnion(github_user_id),
        },
        { merge: true }
      );

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Failed to like GitHub user:", err.message);
      return errorResponse({
        res,
        status: 500,
        message: "Internal server error",
      });
    }
  }
);

export default router;
