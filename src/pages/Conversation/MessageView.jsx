import { useEffect, useRef, useState } from "react";
import { useMessages } from "../../pages/Conversation/MessageContext";
import { db } from "@/firebase/firebaseConfig";
import { collection, onSnapshot, orderBy, query, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";

function MessageView() {
    const { state, dispatch } = useMessages();
    const { currentUser } = useAuth();
    const { selectedConversation } = state;
    const messagesEndRef = useRef(null);
    const [senderProfiles, setSenderProfiles] = useState({});
    const [otherUser, setOtherUser] = useState(null);

    // Scroll to bottom whenever messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [state.messages]);
    
    // Fetch messages from Firestore
    useEffect(() => {
        if (!selectedConversation) return
        
        const fetchOtherParticipantAndUpdateRead = async () => {
          try {
            if (!currentUser?.uid || !selectedConversation) return;

            const conversationRef = doc(db, "conversations", selectedConversation);
            const conversationSnap = await getDoc(conversationRef);

            if (!conversationSnap.exists()) {
              console.warn("Conversation document not found.");
              return;
            }

            const conversationData = conversationSnap.data();
            const participants = conversationData?.participants || [];

            if (!Array.isArray(participants) || participants.length !== 2) {
              console.warn("Unexpected participants format:", participants);
              return;
            }

            // Update the lastReadBy timestamp for the current user
            await updateDoc(doc(db, "conversations", selectedConversation), {
              [`lastReadBy.${currentUser.uid}`]: serverTimestamp()
            });

            const otherUid = participants.find(uid => uid !== currentUser.uid);

            if (!otherUid) return;

            const userSnap = await getDoc(doc(db, "users", otherUid));
            if (userSnap.exists()) {
              setOtherUser(userSnap.data());
            }
          } catch (error) {
            console.error("Error fetching other participant info:", error);
          }
        };
        fetchOtherParticipantAndUpdateRead();

        // console.log("Loading messages for conversation:", selectedConversation);

        const messagesRef = collection(db, "conversations", selectedConversation, "messages")
        const q = query(messagesRef, orderBy("timestamp", "asc"))

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            // console.log("Fetched messages:", messages);
            
            dispatch({ type: "SET_MESSAGES", payload: messages })
        

        
        // Get unique sender IDs from messages
        // Get all unique sender IDs from the messages
        const uniqueSenderIds = [...new Set(messages.map(m => m.senderId))];
        // console.log("Unique sender IDs:", uniqueSenderIds);
        
        // Create a new profile map to store user data
        const profileMap = {...senderProfiles}; // Preserve existing profiles
        
        // Fetch user data for each unique sender ID
        for (const uid of uniqueSenderIds) {
          if (!uid) continue;
          
          // Skip if we already have this user's profile
          if (profileMap[uid]) continue;
          
          try {
            const userSnap = await getDoc(doc(db, "users", uid));
            if (userSnap.exists()) {
              const userData = userSnap.data();
            //   console.log("User data for ID:", uid, userData);
              profileMap[uid] = userData;
            } else {
            //   console.log("No user document found for ID:", uid);
              // Store an empty profile to avoid repeated lookups
              profileMap[uid] = { firstName: "Unknown", role: "User" };
            }
          } catch (error) {
            // console.error("Error fetching user profile:", error);
            profileMap[uid] = { firstName: "Unknown", role: "User" };
          }
        }
        
        // Update state with all fetched profiles
        setSenderProfiles(profileMap);
    })

        return () => unsubscribe()
    }, [selectedConversation, dispatch, currentUser?.uid])

    if (!selectedConversation) {
        return <div className="p-4">No Conversation Selected</div>
    }

    // console.log("Rendering messages with currentUser:", currentUser?.uid);
    // console.log("Chatting with:", otherUser);
    
    return (
        <div className="p-4 space-y-3 overflow-y-auto max-h-[70vh]">
            {state.messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages in this conversation yet</div>
            ) : (
                // Sort messages by timestamp (oldest first)
                [...state.messages]
                .sort((a, b) => {
                    const timeA = a.timestamp?.toMillis?.() || 
                                (a.timestamp instanceof Date ? a.timestamp.getTime() : 0);
                    const timeB = b.timestamp?.toMillis?.() || 
                                (b.timestamp instanceof Date ? b.timestamp.getTime() : 0);
                    return timeA - timeB;
                })
                .map((msg) => {
                    const isSentByCurrentUser = msg.senderId === currentUser?.uid;
                    
                    return (
                        <div key={msg.id} className={`flex flex-col ${isSentByCurrentUser ? "items-end" : "items-start"}`}>
                            {!isSentByCurrentUser && (
                              <div className="flex items-center gap-2 mb-1">
                                <img
                                  src={otherUser?.photoURL || '/src/assets/images/default_pfp.png'}
                                  alt="sender"
                                  className="w-6 h-6 rounded-full"
                                />
                                <div className="text-xs text-gray-500">
                                  {!isSentByCurrentUser && otherUser ? (
                                    `${otherUser.firstName || otherUser.displayName || otherUser.name || "Unknown"} • ${otherUser.role || "User"}`
                                  ) : (
                                    "Unknown sender • User"
                                  )}
                                </div>
                              </div>
                            )}
                            <div className={`p-2 rounded-md max-w-xs ${isSentByCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                                <div className="text-sm">{msg.text}</div>
                                <div className={`text-xs ${isSentByCurrentUser ? "text-blue-100" : "text-gray-500"} text-right`}>
                                    {msg.timestamp instanceof Date 
                                        ? msg.timestamp.toLocaleString()
                                        : msg.timestamp?.toDate?.()?.toLocaleString() || ''}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default MessageView