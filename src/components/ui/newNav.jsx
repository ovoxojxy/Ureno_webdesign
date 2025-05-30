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

    const handleLogout = async () => {
        setLoggingOut(true)
        const result = await doSignOut()
        setLoggingOut(false)

        if (result.success) {
            setTimeout(() => {
                navigate('/')
            }, 1500)
        } else {
            alert("Logout failed. Please try again.")
        }
    }

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