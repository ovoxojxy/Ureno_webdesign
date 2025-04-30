import { addDoc, collection, updateDoc, doc, serverTimestamp } from "firebase/firestore";

async function sendMessage(conversationId, senderId, text) {
    const messageRef = collection(db,  "conversations", conversationId, "messages")

    await addDoc(messageRef, {
        senderId,
        text,
        timestamp: serverTimestamp(),
    })

    await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: {
            text,
            senderId,
            timestamp: serverTimestamp()
        },
        updatedAt: serverTimestamp(),
    })
}