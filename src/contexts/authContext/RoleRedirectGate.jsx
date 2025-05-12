import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const RoleRedirectGate = () => {
    const { user, profile, loading } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Don't redirect while still loading user data
        if (loading) return;

        // Redirect to choose-role only if user exists, profile exists, but role is missing
        if (user && profile && !profile.role && location.pathname !== '/choose-role') {
            navigate('/choose-role');
        }

        // Protect contractor routes
        const contractorRoutes = ['/contractor-dashboard', '/available-projects'];
        if (user && profile && profile.role !== 'contractor' &&
            contractorRoutes.includes(location.pathname)) {
            navigate('/');
        }

        // Don't redirect when user is authenticated and has a role
        // This fixes the refresh issue on contractor dashboard
        console.log("RoleRedirectGate check:", {
            user: !!user,
            profile: !!profile,
            role: profile?.role,
            path: location.pathname
        });
    }, [user, profile, loading, location.pathname, navigate]);

    return null;
}

export default RoleRedirectGate;