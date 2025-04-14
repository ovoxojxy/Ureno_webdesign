import { getFirestore, doc, setDoc } from "firebase/firestore";

export const writeUserData = async (userId, firstName, lastName, email, phoneNumber) => {
    const db = getFirestore();
    await setDoc(doc(db, "users", userId), {
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        phoneNumber,
        isAdmin: false,
        createdAt: new Date()
    })
}