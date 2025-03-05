import Footer from "../components/footer"
import ProfileNav from "@/components/profileNav"
import { Button } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { Bell, Settings, LogOut } from "lucide-react"

import '../styles/FlooringProduct.css'

export default function ProfileDashboard() {
    return (
        <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Profile</title>

        
        <ProfileNav />
        <div className="main-content max-w-6xl mx-auto p-6">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-start">
            

            {/* Overview cards */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Projects</h3>
                        <p className="test-gray-500">3 Ongoing, 5 completed</p>
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


                <Card className="md:col-span-2">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Messages & Notifications</h3>
                        <p className="text-gray-500">2 Unread Messages</p>
                        <Button variant="link" className="mt-2">Go to Messages</Button>
                    </div>
                </Card>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl font-bold mt-4">John Doe</h2>
          <p className="text-gray-500">johndoe@email.com</p>
          <Button className="mt-2">Edit Profile</Button>
        </div>

        </div>
        </div>
            
        <Footer />
        </>
    )
}

