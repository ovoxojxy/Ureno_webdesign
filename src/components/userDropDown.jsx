import profileSVG from '../assets/images/profile-svgrepo-com.png'
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

    const handleLogout = async () =>{
        setLoggingOut(true)
        const result = await doSignOut()
        setLoggingOut(false)
      
        if (result.success) {
          setLoggedOut(true)
          setTimeout(() => {
            navigate('/')
          }, 1500)
        } else {
          alert("Logout failed. Please try again.")
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
