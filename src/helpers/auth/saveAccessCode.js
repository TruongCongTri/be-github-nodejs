
import { db } from "../../services/firebase.js";

/**
 * Save access code and expiration to Firestore for a given phone number.
 * @param {string} phoneNumber - Phone number of the user.
 * @param {string} accessCode - Access code to store.
 * @param {number} expiresAt - Timestamp of expiration.
 * @returns {Promise<void>}
 */
export const saveAccessCode = async (phoneNumber, accessCode, expiresAt) => {
  await db
    .collection("users")
    .doc(phoneNumber)
    .set({ accessCode, expiresAt }, { merge: true });
};
