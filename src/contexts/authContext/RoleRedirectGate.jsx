import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const RoleRedirectGate = () => {
    const { user, profile } = useUser()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (user && profile && !profile.role && location.pathname !== '/choose-role') {
            navigate('/choose-role')
        }
    }, [user, profile, location.pathname, navigate])
    return null
}

export default RoleRedirectGate