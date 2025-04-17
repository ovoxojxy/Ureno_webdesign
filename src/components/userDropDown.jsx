import profileSVG from '../assets/images/profile-svgrepo-com.svg'
import { doSignOut } from "@/firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown'
import "../styles/bootstrap.min.css"; 
import { useContext } from 'react';
import { UserContext } from '@/contexts/authContext/UserContext';
import { useAuth } from '@/contexts/authContext';


const UserDropDown = () => {
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { profile } = useContext(UserContext)

    const handleLogout = async () => {
        await doSignOut ()
        navigate('/')
    }
    
    return (
        <Dropdown >
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                <img src={profileSVG} />
            </Dropdown.Toggle>

            <Dropdown.Menu>

                <Dropdown.Item as={Link} to="/ProfileDashboard">Profile</Dropdown.Item>

                
                <Dropdown.Item as={Link} to="/designerPage">Designs</Dropdown.Item>

                {currentUser?.isAdmin && ( <Dropdown.Item as={Link} to="/Admin">Admin</Dropdown.Item>)}
                

                <Dropdown.Item href="#/action-3">Action</Dropdown.Item>

                <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>   
    )
}


export default UserDropDown
