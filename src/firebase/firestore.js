import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { app } from "./firebaseConfig"; // assumes firebase is initialized in firebase.js

const db = getFirestore(app);

export const getUserProfile = async (userId) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const createUserProfile = async (userId, profileData) => {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, profileData, { merge: true });
  };

export const updateUserProfile = async (userId, updates) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, updates);
};

export { db };