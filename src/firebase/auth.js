import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updatePassword } from "firebase/auth"
import { auth } from "./firebaseConfig"

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const doSignInWithGoogle = async () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()

    try {
        const result = await signInWithPopup(auth, provider)

        const isNewUser = result?.additionalUserInfo?.isNewUser

        if (isNewUser) {
            console.log("New user signed up with Google:", result.user)
        } else {
            console.log("Existing user logged in with Google: ", result.user)
        }

        return result
    } catch (error) {
        console.error("Google Sign-In Error:", error)
    }
   
}

export const doSignOut = () => {
    return auth.signOut()
}

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email)
}

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password)
}

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/`
    })
}