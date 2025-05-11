import { createContext, useContext, useReducer, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const MessagesContext = createContext()

const initialState = {
    conversations: [],
    selectedConversation: null,
    messages: [],
    loading: false,
    currentConversationData: null, // Store full data for the selected conversation
}

function messageReducer(state, action) {
    switch (action.type) {
        case "SET_CONVERSATIONS":
            // Preserve the selectedConversation when updating conversations
            // Sort conversations by most recent message
            const sortedConversations = [...action.payload].sort((a, b) => {
                // Get timestamps or use 0 if not available
                const timeA = a.lastMessage?.timestamp?.toMillis?.() || 
                              (a.lastMessage?.timestamp instanceof Date ? a.lastMessage.timestamp.getTime() : 0) || 
                              a.updatedAt?.toMillis?.() || 0;
                
                const timeB = b.lastMessage?.timestamp?.toMillis?.() || 
                              (b.lastMessage?.timestamp instanceof Date ? b.lastMessage.timestamp.getTime() : 0) || 
                              b.updatedAt?.toMillis?.() || 0;
                
                // Sort descending (newest first)
                return timeB - timeA;
            });

            // If there's a selected conversation, make sure its data is preserved
            let currentConversationData = state.currentConversationData;
            if (state.selectedConversation) {
                const conversationInList = sortedConversations.find(c => c.id === state.selectedConversation);
                if (conversationInList) {
                    currentConversationData = conversationInList;
                }
            }
            
            return {
                ...state, 
                conversations: sortedConversations,
                currentConversationData
            };

        case "UPDATE_LAST_MESSAGE":
            // Find the conversation and update its last message
            const updatedConversations = state.conversations.map(conv => {
                if (conv.id === action.payload.conversationId) {
                    return {
                        ...conv,
                        lastMessage: action.payload.lastMessage,
                        updatedAt: action.payload.lastMessage.timestamp
                    };
                }
                return conv;
            }).sort((a, b) => {
                // Get timestamps or use 0 if not available
                const timeA = a.lastMessage?.timestamp?.toMillis?.() || 
                              (a.lastMessage?.timestamp instanceof Date ? a.lastMessage.timestamp.getTime() : 0) || 
                              a.updatedAt?.toMillis?.() || 0;
                
                const timeB = b.lastMessage?.timestamp?.toMillis?.() || 
                              (b.lastMessage?.timestamp instanceof Date ? b.lastMessage.timestamp.getTime() : 0) || 
                              b.updatedAt?.toMillis?.() || 0;
                
                // Sort descending (newest first)
                return timeB - timeA;
            });
            
            return {
                ...state,
                conversations: updatedConversations
            };

        case "SELECT_CONVERSATION":
            // Only clear messages when selecting a different conversation
            if (state.selectedConversation === action.payload) {
                return state; // No change if selecting the same conversation
            }

            // Find the conversation data if it's in the current list
            const selectedConversationData = state.conversations.find(c => c.id === action.payload) || null;
            
            return { 
                ...state, 
                selectedConversation: action.payload, 
                messages: [],
                currentConversationData: selectedConversationData
            };
            
        case "SET_CURRENT_CONVERSATION_DATA":
            return {
                ...state,
                currentConversationData: action.payload
            };
        
        case "SET_MESSAGES":
            return { ...state, messages: action.payload };
        
        case "ADD_MESSAGE":
            // Check if this message already exists in the array (prevent duplicates)
            const messageExists = state.messages.some(msg => 
                msg.id === action.payload.id ||
                (msg.senderId === action.payload.senderId && 
                 msg.text === action.payload.text && 
                 Math.abs(
                     (msg.timestamp?.toDate?.() || msg.timestamp)?.getTime() - 
                     (action.payload.timestamp?.toDate?.() || action.payload.timestamp)?.getTime()
                 ) < 5000) // Within 5 seconds
            );
            
            if (messageExists) {
                return state; // Don't add duplicate messages
            }
            
            return { 
                ...state, 
                messages: [...state.messages, action.payload].sort((a, b) => {
                    const timeA = a.timestamp?.toMillis?.() || 
                                (a.timestamp instanceof Date ? a.timestamp.getTime() : 0);
                    const timeB = b.timestamp?.toMillis?.() || 
                                (b.timestamp instanceof Date ? b.timestamp.getTime() : 0);
                    return timeA - timeB; // Sort by timestamp ascending (oldest first)
                })
            };
        
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        
        default:
            return state;
    }
}


export function MessagesProvider({ children }) {
    const [state, dispatch] = useReducer(messageReducer, initialState)

    // Listen for changes to the selected conversation document
    useEffect(() => {
        const conversationId = state.selectedConversation;
        if (!conversationId) return;

        console.log(`Setting up listener for conversation ${conversationId}`);
        
        // Listen to the specific conversation document
        const conversationRef = doc(db, "conversations", conversationId);
        const unsubscribe = onSnapshot(conversationRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const conversationData = { id: docSnapshot.id, ...docSnapshot.data() };
                console.log("Conversation data updated:", conversationData);
                
                // Update the current conversation data
                dispatch({ 
                    type: "SET_CURRENT_CONVERSATION_DATA", 
                    payload: conversationData 
                });
                
                // Also update this conversation in the list
                if (state.conversations.length > 0) {
                    const updatedConversations = state.conversations.map(conv => 
                        conv.id === conversationId ? conversationData : conv
                    );
                    dispatch({
                        type: "SET_CONVERSATIONS",
                        payload: updatedConversations
                    });
                }
            } else {
                console.log(`Conversation ${conversationId} does not exist`);
            }
        }, (error) => {
            console.error("Error listening to conversation:", error);
        });
        
        return () => {
            console.log(`Cleaning up listener for conversation ${conversationId}`);
            unsubscribe();
        };
    }, [state.selectedConversation]);

    return (
        <MessagesContext.Provider value={{ state, dispatch}}>
            {children}
        </MessagesContext.Provider>
    )
}

export function useMessages() {
    return useContext(MessagesContext)
}