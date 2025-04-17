import { getFirestore, doc, setDoc } from "firebase/firestore";


export const writeUserData = async (userId, firstName, lastName, email, phoneNumber, displayNameFromAuth, isAdmin) => {
    const db = getFirestore();
    const data = {
        displayName: `${firstName} ${lastName}`.trim(),
        firstName: firstName,
        lastName: lastName,
        email,
        phoneNumber,
        createdAt: new Date()
      };
      
      // Only include isAdmin if explicitly passed
      if (typeof isAdmin === "boolean") {
        data.isAdmin = isAdmin;
      }
      
      await setDoc(doc(db, "users", userId), data, { merge: true });
}