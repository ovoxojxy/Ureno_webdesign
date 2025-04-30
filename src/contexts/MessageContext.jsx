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
        case "SET_CONVERSATION":
            return {...state, conversations: action.payload }

        case "SELECT_CONVERSATION":
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
    const [state, dispatch] = useReducer(messagesReducer, initialState)

    return (
        <MessagesContext.Provider value={{ state, dispatch}}>
            {children}
        </MessagesContext.Provider>
    )
}

export function useMessages() {
    return useContext(MessagesContext)
}