import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
/**
•	Sign up a new user with email and password
•	@param {string} email - User's email
•	@param {string} password - User's password
•	@param {string} displayName - User's display name
•	@returns {Promise} User object
*/
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Update user profile with display name
    await updateProfile(user, { displayName });
    // Store user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      displayName: displayName,
      createdAt: new Date(),
      preferences: {
        theme: "light",
        notifications: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};
/**
•	Sign in an existing user
•	@param {string} email - User's email
•	@param {string} password - User's password
•	@returns {Promise} User object
*/
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};
/**
•	Sign out the current user
•	@returns {Promise} void
*/
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
/**
•	Listen for auth state changes
•	@param {function} callback - Function to call when auth state changes
•	@returns {function} Unsubscribe function
*/
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
/**
•	Get user profile from Firestore
•	@param {string} userId - User's ID
•	@returns {Promise} User profile data
*/
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
