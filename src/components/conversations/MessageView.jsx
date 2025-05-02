import { useEffect } from "react";
import { useMessages } from "./MessageContext";
import { db } from "@/firebase/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";

function MessageView() {
    const { state, dispatch } = useMessages();
    const { currentUser } = useAuth();
    const { selectedConversation } = state;

    useEffect(() => {
        if (!selectedConversation) return
        
        console.log("Loading messages for conversation:", selectedConversation);
        console.log("Current user UID:", currentUser?.uid);

        const messagesRef = collection(db, "conversations", selectedConversation, "messages")
        const q = query(messagesRef, orderBy("timestamp", "asc"))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            console.log("Fetched messages:", messages);
            dispatch({ type: "SET_MESSAGES", payload: messages })
        })

        return () => unsubscribe()
    }, [selectedConversation, dispatch, currentUser?.uid])

    if (!selectedConversation) {
        return <div className="p-4">No Conversation Selected</div>
    }

    console.log("Rendering messages with currentUser:", currentUser?.uid);
    
    return (
        <div className="p-4 space-y-3 overflow-y-auto max-h-[70vh]">
            {state.messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages in this conversation yet</div>
            ) : (
                state.messages.map((msg) => {
                    const isSentByCurrentUser = msg.senderId === currentUser?.uid;
                    console.log(`Message ${msg.id}: senderId=${msg.senderId}, currentUser=${currentUser?.uid}, isSent=${isSentByCurrentUser}`);
                    
                    return (
                        <div key={msg.id} className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}>
                            <div className={`p-2 rounded-md max-w-xs ${isSentByCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                                <div className="text-sm">{msg.text}</div>
                                <div className={`text-xs ${isSentByCurrentUser ? "text-blue-100" : "text-gray-500"} text-right`}>
                                    {msg.timestamp?.toDate().toLocaleString()}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    )
}

export default MessageView