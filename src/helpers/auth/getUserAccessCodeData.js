
import { db } from "../../services/firebase.js";

/**
 * Retrieve access code data (accessCode & expiresAt) for a user.
 * @param {string} phoneNumber
 * @returns {Promise<{ accessCode: string, expiresAt: number } | null>}
 */
export const getUserAccessCodeData = async (phoneNumber) => {
  const doc = await db.collection("users").doc(phoneNumber).get();
  if (!doc.exists) return null;
  return doc.data();
};

