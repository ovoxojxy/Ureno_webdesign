import React, {useState} from "react"
import { useAuth } from "@/contexts/authContext"
import { doSignOut } from "@/firebase/auth"
import { useNavigate } from "react-router-dom"
import LoggedOutHeader from './LoggedOutHeader'
import LoggedInHeader from "./LoggedInHeader"
import Logo from '../../assets/images/UrenoSmall.png'


const NewNav = () => {
    const { userLoggedIn } = useAuth() || { userLoggedIn: false }
    const navigate = useNavigate()
    const [user, setUser] = useState(null);

    const [loggingOut, setLoggingOut] = useState(false)
    const [loggedOut, setLoggedOut] = useState(false)


    return (
    <>
        {userLoggedIn ? (
            <LoggedInHeader user={user} />
        ) : (
            <LoggedOutHeader />
        )}
    </>
)}

export default NewNav