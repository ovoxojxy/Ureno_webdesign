import { useEffect } from "react";
import { useMessages } from "@/contexts/MessageContext";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";

function ConversationList() {
    const { state, dispatch } = useMessages()
    const { currentUser } = useMessages()

    useEffect(() => {
        if (!currentUser) return

        const q = query(
            collection(db, "conversations"),
            where("participants", "array-contains", currentUser.uid)
        )

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const conversations = []
            QuerySnapshot.forEach((doc) => {
                conversations.push({ id: doc.id, ...doc.data() })
            })
            dispatch({ type: "SET_CONVERSATIONS", payload: conversations })
        }) 

        return () => unsubscribe()
    }, [currentUser, dispatch])

    const handleSelectConversation = (conversationId) => {
        dispatch({ type: "SELECT_CONVERSATION", payload: conversationId})
    }

    return (
        <div className="conversation-list">
            <h2 className="text-xl font-bold mb-4">Conversations</h2>
            {state.conversations.length === 0 ? (
                <p>No conversations yet.</p>
            ) : (
                <ul className="space-y-4">
                    {state.conversations.map((conv) => (
                        <li
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={`cursor-pointer p-3 rounded-md ${state.selectedConversation === conv.id ? "bg-gray-300"  : "bg-gray-100"}`}>
                        <div className="font-semibold">Project: {conv.projectId}</div>
                            <div className="text-sm text-gray-600">
                                {conv.lastMessage?.text
                                ? `${conv.lastMessage.text.slice(0, 30)}...` : "No messages yet"}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default ConversationList;