import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, collectionUserData } from '../../firebase/firebaseConfig';
import { getUserProfile } from '../../firebase/firestore'; // assumes you have this set up

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // Firebase user object
  const [profile, setProfile] = useState(null);  // Firestore profile data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profileData = await getUserProfile(currentUser.uid);
          setProfile(profileData);
        } catch (err) {
          console.error("Failed to fetch user profile:", err.message);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};