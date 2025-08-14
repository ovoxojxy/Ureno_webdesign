import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, collectionUserData } from '../../firebase/firebaseConfig';
import { getUserProfile } from '../../firebase/firestore';
import { writeUserData } from '@/firebase/firestore_write_new_user';
import { db } from '@/firebase/firestore';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
// import { useNavigate, useLocation } from 'react-router-dom';


export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // Firebase user object
  const [profile, setProfile] = useState(null);  // Firestore profile data
  const [loading, setLoading] = useState(true);

  // const navigate = useNavigate();
  // const location = useLocation();

  // Track Firestore listeners that need to be cleaned up
  const [firestoreUnsubscribe, setFirestoreUnsubscribe] = useState(null);
  
  useEffect(() => {
    // Handle auth state changes
    const authUnsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Clean up any existing Firestore listeners when auth state changes
      if (firestoreUnsubscribe) {
        console.log("Cleaning up previous Firestore listener");
        firestoreUnsubscribe();
        setFirestoreUnsubscribe(null);
      }
      
      setUser(currentUser);
      
      if (!currentUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      console.log("Current user UID:", currentUser?.uid);
      // Extract first and last name from displayName if possible
      let firstName = null;
      let lastName = null;
      if (currentUser.displayName) {
        const nameParts = currentUser.displayName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      // Check if user profile document exists before writing
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        console.log("User profile doesn't exist yet, creating it.");
        await writeUserData(currentUser.uid, firstName, lastName, currentUser.email, null, currentUser.displayName);
      } else {
        console.log("User profile already exists, skipping creation.");
      }

      
      try {
        // Set initial profile from one-time fetch
        const initialProfile = await getUserProfile(currentUser.uid);
        const fallbackProfile = {
          displayName: currentUser.displayName || "",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "",
          // isAdmin: false
        };
        
        setProfile(initialProfile || fallbackProfile);
        setLoading(false);


        try {
          // We need to ensure the document exists first, then set up listener
          const userDocRef = doc(db, "users", currentUser.uid);
          console.log("Setting up Firestore listener on: /users/" + currentUser.uid);
          
          // First check if document exists
          const docSnapshot = await getDoc(userDocRef);
          if (!docSnapshot.exists()) {
            console.log("Document doesn't exist yet, creating it first");
            // Create the document with basic data to ensure it exists before listening
            await setDoc(userDocRef, {
              displayName: profile.displayName,
              email: profile.email,
              photoURL: profile.photoURL,
              createdAt: new Date()
            }, { merge: true });
          }
          
          // Now set up the listener
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
          
          // Store the unsubscribe function in state so we can clean it up on auth state changes
          setFirestoreUnsubscribe(() => profileUnsubscribe);
        } catch (error) {
          console.error("Error setting up profile listener:", error);
          // Continue without real-time updates
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err.message);
        setLoading(false);
      }
    });

    return () => {
      // Clean up auth listener
      authUnsubscribe();
      
      // Clean up any Firestore listeners
      if (firestoreUnsubscribe) {
        console.log("Cleaning up Firestore listener on component unmount");
        firestoreUnsubscribe();
      }
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};