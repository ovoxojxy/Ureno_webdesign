import { getAuth, onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase/firebaseConfig"
import React, { useContext, useState, useEffect } from "react"


const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isEmailUser, setIsEmailUser] = useState(false)
    const [isGoogleUser, setIsGoogleUser] = useState(false)
    const [redirectAfterAuth, setRedirectAfterAuth] = useState(false)

    const value = {
        currentUser, 
        userLoggedIn,
        isEmailUser,
        isGoogleUser,
        loading,
        redirectAfterAuth,
        setRedirectAfterAuth
    }


    useEffect(() => {
        const auth = getAuth()

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setUserLoggedIn(!!user)

            if (user) {
                const providerId = user.providerData[0]?.providerId
                setIsEmailUser(providerId === "password")
                setIsGoogleUser(providerId === "google.com")
            } else {
                setIsEmailUser(false)
                setIsGoogleUser(false)
            }

            setLoading(false)
            console.log("AuthProvider state updated: userLoggedIn =", !!user, "user:", user?.uid)
        })

        return () => unsubscribe
    }, [])


    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
