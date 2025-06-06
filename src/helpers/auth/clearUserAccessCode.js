import { db } from "../../services/firebase.js";

/**
 * Clears access code and expiration from a user's Firestore document.
 * @param {string} phoneNumber
 * @returns {Promise<void>}
 */
export const clearUserAccessCode = async (phoneNumber) => {
  await db
    .collection("users")
    .doc(phoneNumber)
    .update({ accessCode: "", expiresAt: "" });
};
