import { getFirestore, doc, setDoc } from "firebase/firestore";


export const writeUserData = async (userId, firstName, lastName, email, phoneNumber, displayNameFromAuth, isAdmin) => {
    const db = getFirestore();
    let displayName;
    
    // Use firstName/lastName if provided, otherwise fall back to auth displayName
    if (firstName || lastName) {
        displayName = `${firstName || ''} ${lastName || ''}`.trim();
    } else {
        displayName = displayNameFromAuth || '';
    }
    
    const data = {
        displayName: displayName,
        firstName: firstName || (displayNameFromAuth ? displayNameFromAuth.split(' ')[0] : ''),
        lastName: lastName || (displayNameFromAuth ? displayNameFromAuth.split(' ').slice(1).join(' ') : ''),
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