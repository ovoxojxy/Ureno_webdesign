import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, collectionUserData } from '../../firebase/firebaseConfig';
import { getUserProfile } from '../../firebase/firestore';
import { writeUserData } from '@/firebase/firestore_write_new_user';
import { db } from '@/firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';


export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // Firebase user object
  const [profile, setProfile] = useState(null);  // Firestore profile data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle auth state changes
    const authUnsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log("Current user UID:", currentUser?.uid);
      await writeUserData(currentUser.uid, null, null, currentUser.email, null, currentUser.displayName)

      
      try {
        // Set initial profile from one-time fetch
        const initialProfile = await getUserProfile(currentUser.uid);
        const fallbackProfile = {
          displayName: currentUser.displayName || "",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "",
          isAdmin: false
        };
        
        setProfile(initialProfile || fallbackProfile);
        setLoading(false);


        // Set up real-time listener for profile updates
        const userDocRef = doc(db, "users", currentUser.uid);
        console.log("Setting up Firestore listener on: /users/" + currentUser.uid);
        const profileUnsubscribe = onSnapshot(userDocRef, 
          (doc) => {
            if (doc.exists()) {
              console.log("Received profile update for UID:", currentUser.uid, "Data:", doc.data());
              setProfile(doc.data());
            } else {
              console.warn("User document does not exist for UID:", currentUser.uid);
            }
          },
          (error) => {
            console.error("Error listening to profile updates:", error);
          }
        );
        
        return () => profileUnsubscribe();
      } catch (err) {
        console.error("Failed to fetch user profile:", err.message);
        setLoading(false);
      }
    });

    return () => authUnsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};