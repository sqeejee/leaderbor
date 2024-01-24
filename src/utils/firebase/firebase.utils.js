import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUgh6WBKZyp3CzCOJ9b8sgzQOwrnr13Wg",
  authDomain: "crwn-clothui.firebaseapp.com",
  projectId: "crwn-clothui",
  storageBucket: "crwn-clothui.appspot.com",
  messagingSenderId: "143128131551",
  appId: "1:143128131551:web:a385d88978b19f5136f66a",
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  const { uid, displayName, email } = userAuth;

  if (!displayName) {
    console.error("Display name is null or undefined");
    return;
  }

  // Check if the username (displayName) is already taken
  const usernameDocRef = doc(db, "usernames", displayName);
  const usernameSnapshot = await getDoc(usernameDocRef);

  if (usernameSnapshot.exists()) {
    return; // Exit the function if the username is not unique
  }

  // If the username is unique, proceed to create the user document
  const userDocRef = doc(db, "users", uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const createdAt = new Date();

    try {
      // Set the document in the 'users' collection
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });

      // Set the document in the 'usernames' collection for uniqueness check
      await setDoc(usernameDocRef, { uid });

      console.log("User created:", displayName);
    } catch (error) {
      console.error("Error creating the user:", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (
  email,
  password,
  displayName
) => {
  if (!email || !password) return;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (displayName) {
      await updateDisplayName(userCredential.user, displayName);
    }

    return userCredential;
  } catch (error) {
    console.error("Error creating the user", error.message);
    throw error;
  }
};

const updateDisplayName = async (user, displayName) => {
  try {
    await updateProfile(user, { displayName });
  } catch (error) {
    console.error("Error updating display name", error.message);
    throw error;
  }
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const doesUserExist = async (displayName) => {
  try {
    const userDocRef = doc(db, "usernames", displayName);
    const userSnapshot = await getDoc(userDocRef);

    // Check if the document exists
    console.log("userSnapshot", userSnapshot.exists());
    return userSnapshot.exists();
  } catch (error) {
    return false; // Return false in case of an error
  }
};

//This is all post related stuff
export const addPost = async (userID, username, message, image, value) => {
  try {
    const userPostsQuery = query(
      collection(db, "posts"),
      where("userID", "==", userID)
    );
    const userPostsSnapshot = await getDocs(userPostsQuery);

    // Check if the user already has a post
    if (!userPostsSnapshot.empty) {
      throw new Error("User already has a post. Cannot add another post.");
    }

    // Ensure 'value' is a valid number
    const numericValue = typeof value === "number" ? value : parseFloat(value);

    if (isNaN(numericValue)) {
      throw new Error(
        'Invalid value for post. Please provide a valid number for the "value" field.'
      );
    }

    await addDoc(collection(db, "posts"), {
      userID,
      username,
      message,
      image,
      value: numericValue,
      createdAt: new Date(),
      position: 1, // Initial position for a new post
      timer: 0, // Initial timer value
      isNumberOne: false,
    });
  } catch (error) {
    throw error;
  }
};

// Modify the 'getTopPosts' function
export const getTopPosts = async () => {
  try {
    const postsCollectionRef = collection(db, "posts");
    const q = query(postsCollectionRef, orderBy("value", "desc"), limit(100));
    const querySnapshot = await getDocs(q);

    const topPosts = [];

    let isFirstPost = true; // To ensure only the first post gets isNumberOne: true

    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      if (postData && typeof postData.value === "number") {
        postData.isNumberOne = isFirstPost; // Set isNumberOne based on isFirstPost flag
        isFirstPost = false; // Set the flag to false after the first post
        topPosts.push({ id: doc.id, ...postData });
      } else {
        console.error("Invalid data structure in document:", doc.data());
      }
    });

    return topPosts;
  } catch (error) {
    console.error("Error getting top posts:", error.message);
    throw error;
  }
};

export const doesUserHavePost = async (userID) => {
  try {
    const userPostsQuery = query(
      collection(db, "posts"),
      where("userID", "==", userID)
    );
    const userPostsSnapshot = await getDocs(userPostsQuery);

    return !userPostsSnapshot.empty;
  } catch (error) {
    console.error("Error checking if user has a post:", error.message);
    throw error;
  }
};

export const getPostByUserName = async (username) => {
  try {
    const userPostsQuery = query(
      collection(db, "posts"),
      where("username", "==", username)
    );
    const userPostsSnapshot = await getDocs(userPostsQuery);

    if (!userPostsSnapshot.empty) {
      const postDoc = userPostsSnapshot.docs[0]; // Assuming a user has only one post, adjust as needed
      const postData = postDoc.data();

      return { id: postDoc.id, ...postData };
    } else {
      throw new Error(`No post found for user with username: ${username}`);
    }
  } catch (error) {
    console.error(
      `Error getting post for user with username ${username}:`,
      error.message
    );
    throw error;
  }
};
