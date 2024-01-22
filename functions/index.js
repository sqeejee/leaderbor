const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.updateTopPostTimer = functions.pubsub.schedule('every 1 minutes').timeZone('UTC').onRun(async (context) => {
  try {
    const postsCollectionRef = admin.firestore().collection('posts');
    const topPostQuery = postsCollectionRef.where('isNumberOne', '==', true).limit(1);
    const topPostSnapshot = await topPostQuery.get();

    if (!topPostSnapshot.empty) {
      const topPostDoc = topPostSnapshot.docs[0];
      const currentTimer = topPostDoc.data().timer || 0;
      
      await topPostDoc.ref.update({
        timer: currentTimer + 1, // Increment the timer by 1 (adjust as needed)
        isNumberOne: true,
      });
    }
  } catch (error) {
    console.error('Error updating top post timer:', error.message);
  }

  return null;
});
