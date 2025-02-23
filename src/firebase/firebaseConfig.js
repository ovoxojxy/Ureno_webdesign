import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app);

async function collectionUserData(user) {
    const userDocRef = doc(db, "users", user.uid)
    const docData = {
        email: user.email,
        displayName: user.displayName || 'New User',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp()
    }

    try {
        await setDoc(userDocRef, docData, { merge: true })
        console.log("User document created/updated succesfully")
    } catch (error) {
        console.error("Error creating/updating user document", error)
    }
}

onAuthStateChanged(auth, async (user) => {
    if(user != null) {
        console.log('logged in!')
        await collectionUserData(user)
    } else {
        console.log('No user')
    }
})

async function fetchTodos() {
    const todosCol = collection(db, 'todos')
    const snapshot = await getDocs(todosCol)
    snapshot.forEach(doc => {
        console.log(doc.id, "=>", doc.data())
    })
}

export { auth, provider, signInWithPopup, collectionUserData}