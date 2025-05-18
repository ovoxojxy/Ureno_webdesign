import profileSVG from '../assets/images/profile-svgrepo-com.svg'
import { doSignOut } from "@/firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown'
import "../styles/bootstrap.min.css"; 
import { useContext, useState } from 'react';
import { UserContext } from '@/contexts/authContext/UserContext';
import { useAuth } from '@/contexts/authContext';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from './ui/LoadingSpinner';


const UserDropDown = () => {
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { profile } = useContext(UserContext)
    const { toast } = useToast()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            
            // Show toast notification
            toast({
                title: "Logging out",
                description: "You are being signed out...",
            })
            
            await doSignOut()
            
            // Navigate after a slight delay to allow the toast to be seen
            setTimeout(() => {
                navigate('/')
                setIsLoggingOut(false)
            }, 1000)
        } catch (error) {
            console.error("Logout error:", error)
            toast({
                variant: "destructive",
                title: "Logout failed",
                description: "There was an error signing you out.",
            })
            setIsLoggingOut(false)
        }
    }
    
    if (isLoggingOut) {
        return <LoadingSpinner />
    }
    
    return (
        <Dropdown >
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                <img src={profileSVG} />
            </Dropdown.Toggle>

            <Dropdown.Menu>

                {profile?.role === 'contractor' ? (
                  <Dropdown.Item as={Link} to="/contractor-dashboard">Dashboard</Dropdown.Item>
                ) : (
                  <Dropdown.Item as={Link} to="/ProfileDashboard">Profile</Dropdown.Item>
                )}

                
                <Dropdown.Item as={Link} to="/designerPage">Designs</Dropdown.Item>

                {currentUser?.isAdmin && ( <Dropdown.Item as={Link} to="/Admin">Admin</Dropdown.Item>)}
                

                <Dropdown.Item href="#/action-3">Action</Dropdown.Item>

                <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>   
    )
}


export default UserDropDown
