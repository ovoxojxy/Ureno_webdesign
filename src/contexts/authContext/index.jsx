import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase/firebaseConfig"
import React, { useContext, useState, useEffect } from "react"

const AuthContext = React.createContext({})

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isEmailUser, setIsEmailUser] = useState(false)
    const [isGoogleUser, setIsGoogleUser] = useState(false)

    const value = {
        currentUser, 
        userLoggedIn,
        isEmailUser,
        isGoogleUser,
        loading
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user)

                const isEmail = user.providerData.some(
                    (provider) => provider.providerId === "password"
                )
                setIsEmailUser(isEmail)

                setUserLoggedIn(true)
            }else{
                setCurrentUser(null)
                setUserLoggedIn(false)
            }
            setLoading(false)
        
        })
        return () => unsubscribe()
    }, [])


    

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
