import { useEffect, useContext, useState } from "react";
import { useMessages } from "@/pages/Conversation/MessageContext";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, onSnapshot, QuerySnapshot, doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";
import { UserContext } from "@/contexts/authContext/UserContext";
import { Link } from "react-router-dom";

function ConversationList() {
    const { state, dispatch } = useMessages()
    const { currentUser } = useAuth()
    const { profile } = useContext(UserContext)
    const [projectMeta, setProjectMeta] = useState({})
    const [participantNames, setParticipantNames] = useState({})
    const backPath = profile?.role === "contractor" ? "/contractor-dashboard" : "/ProfileDashboard"

    // Fetch project titles for all conversations
    useEffect(() => {
        // Clear project titles when user changes
        setProjectMeta({});
    }, [currentUser]);

    // Effect to fetch participant names for each conversation
    useEffect(() => {
        if(!state.conversations || state.conversations.length === 0) return;
         const fetchParticipantNames = async () => {
            const names = {};
            const fetchPromises = state.conversations.map(async (conv) => {
                const otherId = conv.participants?.find(uid => uid !== currentUser.uid);
                if (!otherId || participantNames[otherId]) return;

                try {
                    const userRef = doc(db, "users", otherId);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        names[otherId] = userData.displayName || `${userData.firstName || "Unkown"} ${userData.lastName || ""}`.trim();
                }else {
                    names[otherId] = "Unkown User"
                }
            } catch (error) {
                console.error(`Error fetching user ${otherId}:`, error);
                names[otherId] = "Error Loading User";
         }
    })

    await Promise.all(fetchPromises)
    setParticipantNames(prev => ({ ...prev, ...names }))
    }
    fetchParticipantNames()
}, [state.conversations, participantNames]);

    // Effect to fetch project data for each conversation
    useEffect(() => {
        if (!state.conversations || state.conversations.length === 0) return;
        
        const fetchProjectTitle = async () => {
            const titles = {};
            const fetchPromises = state.conversations.map(async (conversation) => {
                if (!conversation.projectId || projectMeta[conversation.projectId]) return;
                
                try {
                    const projectRef = doc(db, "projects", conversation.projectId);
                    const projectSnap = await getDoc(projectRef);
                    
                    if (projectSnap.exists()) {
                        const projectData = projectSnap.data();
                        titles[conversation.projectId] = {
                            title: projectData.title || "Untitled Project",
                            status: projectData.status || "Unknown Status",
                        }
                    } else {
                        titles[conversation.projectId] = "Unknown Project";
                    }
                } catch (error) {
                    console.error(`Error fetching project ${conversation.projectId}:`, error);
                    titles[conversation.projectId] = "Error Loading Project";
                }
            });
            
            await Promise.all(fetchPromises);
            setProjectMeta(prev => ({...prev, ...titles}));
        };
        
        fetchProjectTitle();
    }, [state.conversations, projectMeta]);

    useEffect(() => {
        if (!currentUser) {
            console.log("No current user found — exiting useEffect.");
            return;
        }

        console.log("Current user UID:", currentUser.uid);


        const q = query(
            collection(db, "conversations"),
            where("participants", "array-contains", currentUser.uid)
        )

        

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            console.log("onSnapshot triggered");
            const conversations = []
            QuerySnapshot.forEach((doc) => {
                conversations.push({ id: doc.id, ...doc.data() })
            })


            conversations.sort((a, b) => {
                const timeA = a.lastMessage?.timestamp?.toMillis?.() || 0;
                const timeB = b.lastMessage?.timestamp?.toMillis?.() || 0;
                return timeB - timeA;
            })


            console.log("Fetched conversations:", conversations);
            dispatch({ type: "SET_CONVERSATIONS", payload: conversations })
        }) 

        return () => unsubscribe()
    }, [currentUser, dispatch])

    // console.log("Conversations in state:", state.conversations);


    const handleSelectConversation = (conversationId) => {
        console.log(`Selecting conversation: ${conversationId}, current selection: ${state.selectedConversation}`);
        dispatch({ type: "SELECT_CONVERSATION", payload: conversationId})
    }

    // Generate two arrays: visible conversations from state and currently selected conversation if not in the list
    const visibleConversations = state.conversations;
    const selectedConversation = state.selectedConversation && 
                                !visibleConversations.some(c => c.id === state.selectedConversation) ? 
                                { id: state.selectedConversation, projectId: "Selected Conversation" } : 
                                null;

    // console.log("Selected conversation:", state.selectedConversation);
    // console.log("Visible conversations:", visibleConversations.map(c => c.id));
    
    return (
        <div className="conversation-list">
            <div className="flex items-center gap-3 ">
            <Link to={backPath} className="text-blue-500 text-3xl font-bold hover:scale-110 hover:text-blue-700 transition-all duration-200 flex items-center justify-center">&lt;</Link>
                <h2 className="text-xl font-bold mb-4">Conversations</h2>
            </div>
           
            {visibleConversations.length === 0 && !selectedConversation ? (
                <p>No conversations yet.</p>
            ) : (
                <ul className="space-y-4">
                    {/* Show visible conversations from Firestore */}
                    {visibleConversations.map((conv) => {
                        const lastRead = conv.lastReadBy?.[currentUser.uid]?.toMillis?.() || 0;
                        const lastMsg = conv.lastMessage?.timestamp?.toMillis?.() || 0;
                        const isUnread = lastMsg > lastRead;

                        return (
                            <li
                                key={conv.id}
                                onClick={() => handleSelectConversation(conv.id)}
                                className={`cursor-pointer p-3 rounded-md ${
                                    state.selectedConversation === conv.id
                                        ? "bg-blue-100 border-2 border-blue-500"
                                        : "bg-gray-100"
                                } ${isUnread ? "font-bold text-blue-800" : "text-gray-700"}`}
                            >
                                <div className="font-medium text-gray-800">
                                    {participantNames[conv.participants?.find(uid => uid !== currentUser.uid)] || "loading..."}
                                </div>
                                <div>
                                    Project: {conv.projectTitle || projectMeta[conv.projectId]?.title || "Loading..."}
                                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                        projectMeta[conv.projectId]?.status?.toLowerCase() === "in progress"
                                            ? "bg-green-200 text-green-800"
                                            : "bg-yellow-200 text-yellow-800"
                                    }`}>
                                        {projectMeta[conv.projectId]?.status || "Unknown Status"}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {conv.lastMessage?.text
                                        ? `${conv.lastMessage.text.slice(0, 30)}...`
                                        : "No messages yet"}
                                    {isUnread && <span className="text-blue-500 ml-2">•</span>}
                                </div>
                            </li>
                        );
                    })}
                    
                    {/* If there is a selected conversation not in the visible list, show it too */}
                    {selectedConversation && (
                        <li
                        key={selectedConversation.id}
                        onClick={() => handleSelectConversation(selectedConversation.id)}
                        className="cursor-pointer p-3 rounded-md bg-blue-100 border-2 border-blue-500">
                            <div className="font-semibold">Project: {selectedConversation.projectTitle || projectMeta[selectedConversation.projectId] || "Loading..."}</div>
                            <div className="text-sm text-gray-600">
                                Currently selected conversation
                            </div>
                        </li>
                    )}
                </ul>
            )}
        </div>
    )
}

export default ConversationList;