import * as React from "react";
import profileSVG from '../assets/images/profile-svgrepo-com.svg'
import { doSignOut } from "@/firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown'
import { User } from "lucide-react";
import "../styles/bootstrap.min.css"; 


const UserDropDown = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await doSignOut ()
        navigate('/')
    }
    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                <img src={profileSVG} />
            </Dropdown.Toggle>

            <Dropdown.Menu>

                <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>

                <Dropdown.Item href="#/action-2">3D Renderings</Dropdown.Item>

                <Dropdown.Item href="#/action-3">Action</Dropdown.Item>

                <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>   
    )

}

export default UserDropDown
