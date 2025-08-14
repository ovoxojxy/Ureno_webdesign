import { addDoc, collection, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

/**
 * Send a message to a conversation and update the last message
 * @param {string} conversationId - The ID of the conversation
 * @param {string} senderId - The ID of the sender
 * @param {string} text - The message text
 * @param {Function} [dispatch] - Optional dispatch function from MessageContext
 */
async function sendMessage(conversationId, senderId, text, dispatch = null) {
    if (!conversationId || !senderId || !text) {
        console.error("Missing required parameters for sendMessage");
        return;
    }

    try {
        // Add the message document to the messages subcollection
        const messageRef = collection(db, "conversations", conversationId, "messages");
        await addDoc(messageRef, {
            senderId,
            text,
            timestamp: serverTimestamp(),
        });

        // Create last message object with two versions:
        // 1. For Firestore with serverTimestamp()
        // 2. For immediate UI update with new Date()
        const lastMessageForFirestore = {
            text,
            senderId,
            timestamp: serverTimestamp()
        };
        
        // For immediate UI update
        const lastMessageForUI = {
            text,
            senderId,
            timestamp: new Date() // Use JavaScript Date for immediate display
        };

        // Update the conversation document with the last message
        await updateDoc(doc(db, "conversations", conversationId), {
            lastMessage: lastMessageForFirestore,
            updatedAt: serverTimestamp()
        });

        // If dispatch function is provided, update the context state immediately
        if (dispatch) {
            // Add the message to the messages array for immediate display
            dispatch({
                type: "ADD_MESSAGE",
                payload: {
                    id: Date.now().toString(), // Temporary ID until we get the real one from Firestore
                    senderId,
                    text,
                    timestamp: new Date() // Use current time for immediate display
                }
            });
            
            // Update the conversation's last message
            dispatch({
                type: "UPDATE_LAST_MESSAGE",
                payload: {
                    conversationId,
                    lastMessage: lastMessageForUI
                }
            });
        }

        return true;
    } catch (error) {
        console.error("Error sending message:", error);
        return false;
    }
}

export default sendMessage;