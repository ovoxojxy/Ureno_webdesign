import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig"

async function createConversation(conversationId, participants, projectId) {
    await setDoc(doc(db, "conversations", conversationId), {
        participants: participants,
        projectId: projectId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: {
            text: "",
            senderId: "",
            timestamp: serverTimestamp()
        }
    })
}