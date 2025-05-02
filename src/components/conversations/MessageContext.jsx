import { createContext, useContext, useReducer } from "react";

const MessagesContext = createContext()

const initialState = {
    conversations: [],
    selectedConversation: null,
    messages: [],
    loading: false,
}

function messageReducer(state, action) {
    switch (action.type) {
        case "SET_CONVERSATIONS":
            // Preserve the selectedConversation when updating conversations
            return {
                ...state, 
                conversations: action.payload,
                // If the currently selected conversation is no longer in the list,
                // this will preserve it so the UI still works
            }

        case "SELECT_CONVERSATION":
            // Only clear messages when selecting a different conversation
            if (state.selectedConversation === action.payload) {
                return state; // No change if selecting the same conversation
            }
            return { ...state, selectedConversation: action.payload, messages: [] };
        
        case "SET_MESSAGES":
            return { ...state, messages: action.payload };
        
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] };
        
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        
        default:
            return state;
    }
}


export function MessagesProvider({ children }) {
    const [state, dispatch] = useReducer(messageReducer, initialState)

    return (
        <MessagesContext.Provider value={{ state, dispatch}}>
            {children}
        </MessagesContext.Provider>
    )
}

export function useMessages() {
    return useContext(MessagesContext)
}