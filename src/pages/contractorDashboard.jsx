import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/authContext/UserContext";
import { useAuth } from "@/contexts/authContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Link } from "react-router-dom";
import ProfileNav from "@/components/profileNav";
import defaultProfile from "@/assets/images/default_pfp.png";

const ContractorDashboard = () => {
    const { profile } = useContext(UserContext);
    const { currentUser } = useAuth();
    const [availableCount, setAvailibleCount] = useState(0);
    const [inquiredCount, setInquirdCount] = useState(0);
    const [acceptedCount, setAcceptedCount] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!profile?.role || profile.role !== "contractor") return;

        const fetchProjectStats = async () => {
            try {
                console.log("Fetching project stats for contractor role:", profile.role);
                
                // Use the root-level projects collection to match AvailableProjects component
                const availableQuery = query(
                    collection(db, "projects"),
                    where("status", "==", "submitted")
                );
                
                // For inquired and accepted, also use the root-level projects collection
                const inquiredQuery = query(
                    collection(db, "projects"),
                    where("status", "==", "inquiry"),
                    where("inquiredBy", "array-contains", currentUser?.uid || "")
                );

                const acceptedQuery = query(
                    collection(db, "projects"),
                    where("status", "==", "accepted"),
                    where("inquiredBy", "array-contains", currentUser?.uid || "")
                );

                try {
                    // Execute all queries in parallel for better performance
                    const [availableSnap, inquiredSnap, acceptedSnap] = await Promise.all([
                        getDocs(availableQuery),
                        getDocs(inquiredQuery),
                        getDocs(acceptedQuery)
                    ]);
                    
                    console.log("Available projects count:", availableSnap.size);
                    console.log("Inquired projects count:", inquiredSnap.size);
                    console.log("Accepted projects count:", acceptedSnap.size);
                    
        
                    setAvailibleCount(availableSnap.size);
                    setInquirdCount(inquiredSnap.size);
                    setAcceptedCount(acceptedSnap.size);
                    setError(null);
                } catch (error) {
                    console.error("Error in queries:", error);
                    // Try individual queries to see which one fails
                    try {
                        const availableSnap = await getDocs(availableQuery);
                        setAvailibleCount(availableSnap.size);
                        console.log("Available query succeeded:", availableSnap.size);
                    } catch (e) {
                        console.error("Available query failed:", e);
                        setAvailibleCount(0);
                    }
                    
                    try {
                        const inquiredSnap = await getDocs(inquiredQuery);
                        setInquirdCount(inquiredSnap.size);
                        console.log("Inquired query succeeded:", inquiredSnap.size);
                    } catch (e) {
                        console.error("Inquired query failed:", e);
                        setInquirdCount(0);
                    }
                    
                    try {
                        const acceptedSnap = await getDocs(acceptedQuery);
                        setAcceptedCount(acceptedSnap.size);
                        console.log("Accepted query succeeded:", acceptedSnap.size);
                    } catch (e) {
                        console.error("Accepted query failed:", e);
                        setAcceptedCount(0);
                    }
                }
            } catch (err) {
                console.error("Error fetching project stats:", err);
                setError(err.message);
                // Set all counts to 0 to avoid showing stale data
                setAvailibleCount(0);
                setInquirdCount(0);
                setAcceptedCount(0);
            }
        };

        fetchProjectStats();
    }, [currentUser, profile]);

    return (
      <>
        <ProfileNav />
        <div className="main-content max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded shadow">
                <h3 className="text-lg font-semibold">Projects</h3>
                <p className="text-gray-500">
                  {availableCount} Available, {inquiredCount} Inquired, {acceptedCount} Accepted
                </p>
                <Link to="/available-projects">
                  <button className="mt-2 text-blue-500 hover:underline">Browse Projects</button>
                </Link>
              </div>

              <div className="p-4 border rounded shadow">
                <h3 className="text-lg font-semibold">Messages & Notifications</h3>
                <p className="text-gray-500">Check for project updates and messages</p>
                <Link to="/messages">
                  <button className="mt-2 text-blue-500 hover:underline">Go to Messages</button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center md:col-span-1 text-center">
              <h2 className="text-2xl font-bold mt-4">{profile?.username || profile?.firstName || "Contractor"}</h2>
              <img src={defaultProfile} alt="profile" className="w-24 h-24 rounded-full my-2" />
              <p className="text-gray-500">{profile?.email}</p>
              <Link to="/edit-profile">
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
};

export default ContractorDashboard;