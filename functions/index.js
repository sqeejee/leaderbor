const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.updateTopPostTimer = functions.pubsub
  .schedule("every 30 seconds")
  .timeZone("UTC")
  .onRun(async (context) => {
    try {
      const postsCollectionRef = admin.firestore().collection("posts");

      // Check if tphere is an existing top post
      const existingTopPostQuery = postsCollectionRef
        .where("isNumberOne", "==", true)
        .limit(1);
      const existingTopPostSnapshot = await existingTopPostQuery.get();

      if (!existingTopPostSnapshot.empty) {
        // Reset isNumberOne for existing top post
        const existingTopPostDoc = existingTopPostSnapshot.docs[0];
        await existingTopPostDoc.ref.update({
          isNumberOne: false,
        });
      }

      // Find the new top post
      const topPostQuery = postsCollectionRef.orderBy("value", "desc").limit(1);
      const topPostSnapshot = await topPostQuery.get();

      if (!topPostSnapshot.empty) {
        const topPostDoc = topPostSnapshot.docs[0];
        const currentTimer = topPostDoc.data().timer || 0;

        // Update the new top post
        await topPostDoc.ref.update({
          timer: currentTimer + 30, // Increment the timer by 30 (seconds)
          isNumberOne: true,
        });
      }
    } catch (error) {
      console.error("Error updating top post timer:", error.message);
    }

    return null;
  });
