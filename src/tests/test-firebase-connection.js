import { db } from "../services/firebase.js";

// Test Firestore connection
(async () => {
  try {
    const testRef = db.collection("test").doc("ping");
    await testRef.set({ timestamp: new Date().toISOString() });

    const doc = await testRef.get();
    console.log("✅ Firebase connected. Doc data:", doc.data());
  } catch (error) {
    console.error("❌ Firebase test failed:", error);
  }
})();
// node src/tests/test-firebase-connection.js  