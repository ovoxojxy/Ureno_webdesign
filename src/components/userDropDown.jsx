import profileSVG from '../assets/images/profile-svgrepo-com.svg'
import { doSignOut } from "@/firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown'
import "../styles/bootstrap.min.css"; 


const UserDropDown = () => {
    const navigate = useNavigate()

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
                

                <Dropdown.Item href="#/action-3">Action</Dropdown.Item>

                <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>   
    )
}


export default UserDropDown
