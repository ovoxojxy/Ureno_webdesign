import { useState, useRef } from "react";
import { useMessages } from "./MessageContext";
import { useAuth } from "@/contexts/authContext";
import { db } from "@/firebase/firebaseConfig";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import sendMessage from "./sendMessage";

function MessageInput() {
    const [text, setText] = useState("")
    const inputRef = useRef(null)
    const { state, dispatch } = useMessages()
    const { currentUser } = useAuth();
    const { selectedConversation } = state

    const handleSend = async (e) => {
        e.preventDefault()
        if (!text.trim()) return

        // Save the text locally before clearing the input
        const messageText = text.trim()
        
        // Clear the input immediately for better user experience
        setText("")

        try {
            // Use the dedicated sendMessage function with the dispatch function
            // This will handle both Firestore updates and local state updates
            const success = await sendMessage(
                selectedConversation,
                currentUser.uid,
                messageText,
                dispatch
            );
            
            if (success) {
                console.log("Message sent successfully");
            } else {
                console.error("Failed to send message");
                // Optionally restore the message text if sending failed
                // setText(messageText);
            }
            
            // Focus back on the input for better UX
            inputRef.current?.focus()
        } catch (error) {
            console.error("Error sending message:", error)
            // In case of error, we might want to restore the message text
            // setText(messageText)
        }
    }

    if (!selectedConversation) return null

    return (
        <form onSubmit={handleSend} className="flex items-center p-4 border-t">
            <input 
                ref={inputRef}
                type="text" 
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 p-2 border rounded-md"
                // Add onKeyDown to support sending with Enter and clearing with Escape
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        setText('');
                        e.target.blur();
                    }
                }}
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