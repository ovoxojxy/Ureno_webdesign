import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig"
import { useEffect, useState } from "react"


import Footer from "../../components/footer"
import ProfileNav from "@/components/profileNav"
import { Button } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { Bell, Settings, LogOut } from "lucide-react"
import defaultProfile from '../../assets/images/default_pfp.png'
import { Link } from 'react-router-dom'
import { useUser } from "../../contexts/authContext/UserContext";
import { useMessages } from "../Conversation/MessageContext"

import '../../styles/FlooringProduct.css'

export default function ProfileDashboard() {
    const {user, profile, loading } = useUser();
    const messages = useMessages();
    const [projects, setProjects] = useState([])
    const [projectsLoading, setProjectsLoading] = useState(true)

    const [savedMaterials, setSavedMaterials] = useState([])
    const [savedMaterialsLoading, setSavedMaterialsLoading] = useState(true)

    const [conversationCount, setConversationCount] = useState(0);
    const [readConversations, setReadConversations] = useState(0);
    const [unreadConversations, setUnreadConversations] = useState(0);

    

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user) return

            const projectsRef = collection(db, "projects")
            const q = query(projectsRef, where("ownerId", "==", user.uid))

            try {
                const querySnapshot = await getDocs(q)
                const userProjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))

                setProjects(userProjects)
            } catch (error) {
                console.error("Error fetching projects: ", error)
            } finally {
                setProjectsLoading(false)
            }
        }

            const fetchSavedMaterials = async () => {
                if (!user) return

                const savedRef = collection(db, "savedMaterials")
                const q = query(savedRef, where("userId", "==", user.uid))

                try {
                    const querySnapshot = await getDocs(q)
                    const materials = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))

                    setSavedMaterials(materials)
                } catch (error){
                    console.error("Error fetching saved materials:", errors)
                } finally {
                    setSavedMaterialsLoading(false)
                }
            }

            const fetchConversations = async () => {
                if (!user) return;

                const convRef = collection(db, "conversations");
                const q = query(convRef, where("participants", "array-contains", user.uid));

                try {
                    const snapshot = await getDocs(q);
                    setConversationCount(snapshot.size);

                    let readCount = 0;
                    let unreadCount = 0;

                    snapshot.docs.forEach(doc => {
                      const data = doc.data();
                      const lastMsg = data.lastMessage?.timestamp?.toMillis?.() || 0;
                      const lastRead = data.lastReadBy?.[user.uid]?.toMillis?.() || 0;
                      if (lastMsg > lastRead) {
                        unreadCount++;
                      } else {
                        readCount++;
                      }
                    });

                    setReadConversations(readCount);
                    setUnreadConversations(unreadCount);
                } catch (error) {
                    console.error("Error fetching conversations:", error);
                }
            };
        
        fetchProjects()
        fetchSavedMaterials()
        fetchConversations();
    }, [user])


    if (loading) return <p>Loading...</p>;
    if (!user || !profile) return <p>User not found nor not logged in.</p>

    return (
        <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Profile</title>

        
        <ProfileNav />
        <div className="main-content max-w-6xl mx-auto p-6">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 ">
            

            {/* Overview cards */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Projects</h3>


                        {projectsLoading ? (
                            <p className="text-gray-500">Loading project stats...</p>
                            ) : (
                                <p className="text-gray-500">
                                    {projects.filter(p => p.status === "submitted").length} Submitted, {" "}
                                    {projects.filter(p => p.status === "inquiry").length} Pending, {" "}
                                    {projects.filter(p => p.status === "completed").length} Completed
                                </p>
                            )}

                        <Link to="/projects">
                            <Button variant="link" className="mt-2">View projects</Button>
                        </Link>
                        
                    </div>
                </Card>

                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Saved Items</h3>
                        {savedMaterialsLoading ? (
                            <p className="text-gray-500">Loading saved materials...</p>
                        ) : (
                            <p className="text-gray-500">{savedMaterials.length} Materials Favorited</p>
                        )}

                        <Link to="/savedItems">
                            <Button variant="link" className="mt-2">View Favorites</Button>
                        </Link>
                        
                    </div>
                </Card>


                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Messages & Notifications</h3>
                        <p className="text-gray-500">
                          {conversationCount} Conversation{conversationCount !== 1 ? 's' : ''} — 
                           {unreadConversations}  Unread, {readConversations} Read
                        </p>
                        <Link to="/messages">
                            <Button variant="link" className="mt-2">Go to Messages</Button>
                        </Link>
                        
                    </div>
                </Card>
            </div>

            <div className="flex flex-col items-center md:col-span-1 text-center ">
            <h2 className="text-2xl font-bold mt-4">{profile.username || user.displayName}</h2>
            <img src={defaultProfile} />
            <p className="text-gray-500">{user.email}</p>
            
            <Link to="/edit-profile">
                <Button className="mt-2">Edit Profile</Button>
            </Link>
            
        </div>

        </div>
        </div>
            
        <Footer />
        </>
    )
}
