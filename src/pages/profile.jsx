import Footer from "../components/footer"
import ProfileNav from "@/components/profileNav"
import { Button } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { Bell, Settings, LogOut } from "lucide-react"
import defaultProfile from '../assets/images/default_pfp.png'
import { Link } from 'react-router-dom'
import { useUser } from "../contexts/authContext/UserContext";

import '../styles/FlooringProduct.css'

export default function ProfileDashboard() {
    const {user, profile, loading } = useUser();

    if (loading) return <p>Loading...</p>;
    if (!user || !profile) return <p>User not found nor not logged in.</p>
    return (
        <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Profile</title>

        
        <ProfileNav />
        <div className="main-content max-w-6xl mx-auto p-6">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 ">
            

            {/* Overview cards */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Projects</h3>
                        {/* <p className="test-gray-500">3 Ongoing, 5 completed</p> */}

                        <p classname = "text-gray-500">
                            {profile.homeProjects?.filter(p => p.status === "in progress").length || 0} Ongoing, {" "}
                            {profile.homeProjects?.filter(p => p.status === "in progress").length || 0} Completed
                        </p>
                        <Button variant="link" className="mt-2">View projects</Button>
                    </div>
                </Card>

                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Saved Items</h3>
                        <p className="text-gray-500">12 Materials Favorited</p>
                        <Button variant="link" className="mt-2">View Favorites</Button>
                    </div>
                </Card>


                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Messages & Notifications</h3>
                        <p className="text-gray-500">2 Unread Messages</p>
                        <Button variant="link" className="mt-2">Go to Messages</Button>
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

