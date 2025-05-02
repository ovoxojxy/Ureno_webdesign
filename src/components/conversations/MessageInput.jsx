import { useState } from "react";
import { useMessages } from "./MessageContext";
import { useAuth } from "@/contexts/authContext";
import { db } from "@/firebase/firebaseConfig";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";

function MessageInput() {
    const [text, setText] = useState("")
    const { state, dispatch } = useMessages()
    const { currentUser } = useAuth();
    const { selectedConversation } = state

    const handleSend = async (e) => {
        e.preventDefault()
        if (!text.trim()) return

        const messageData = {
            senderId: currentUser.uid,
            text: text.trim(),
            timestamp: serverTimestamp(),
        }

        const messagesRef = collection(db, "conversations", selectedConversation, "messages")
        await addDoc(messagesRef, messageData)

        const conversationRef = doc(db, "conversations", selectedConversation)
        await updateDoc(conversationRef, {
            lastMessage: {
                text: messageData.text,
                senderId: currentUser.uid,
                timestamp: serverTimestamp(),
            },
            updatedAt: serverTimestamp(),
        })

        setText("")
    }

    if (!selectedConversation) return null

    return (
        <form onSubmit={handleSend} className="flex items-center p-4 border-t">
            <input 
                type="text" 
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 p-2 border rounded-md"
            />
            <button 
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Send
            </button>
        </form>
    )
}

export default MessageInput