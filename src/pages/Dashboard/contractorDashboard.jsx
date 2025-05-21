import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/authContext/UserContext";
import { useAuth } from "@/contexts/authContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import ProfileNav from "@/components/profileNav";
import defaultProfile from "@/assets/images/default_pfp.png";

const ContractorDashboard = () => {
    const { profile } = useContext(UserContext);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [availableProjects, setAvailableProjects] = useState([]);
    const [inquiredProjects, setInquiredProjects] = useState([]);
    const [pendingApprovalProjects, setPendingApprovalProjects] = useState([]);
    const [inProgressProjects, setInProgressProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!profile?.role || profile.role !== "contractor" || !currentUser) {
            setLoading(false);
            return;
        }

        const fetchProjects = async () => {
            try {
                console.log("Fetching projects for contractor:", currentUser.uid);
                setLoading(true);
                
                // Available projects (submitted status)
                const availableQuery = query(
                    collection(db, "projects"),
                    where("status", "==", "submitted")
                );
                
                // Projects the contractor has inquired about
                const inquiredQuery = query(
                    collection(db, "projects"),
                    where("status", "==", "inquiry"),
                    where("inquiredBy", "array-contains", currentUser.uid)
                );

                // Projects pending approval
                const pendingApprovalQuery = query(
                    collection(db, "projects"),
                    where("status", "==", "pending_approval"),
                    where("requestedBy", "array-contains", currentUser.uid)
                );

                // Projects in progress (accepted)
                const inProgressQuery = query(
                    collection(db, "projects"),
                    where("status", "==", "in progress"),
                    where("contractorId", "==", currentUser.uid)
                );

                try {
                    // Execute all queries in parallel for better performance
                    const [availableSnap, inquiredSnap, pendingApprovalSnap, inProgressSnap] = await Promise.all([
                        getDocs(availableQuery),
                        getDocs(inquiredQuery),
                        getDocs(pendingApprovalQuery),
                        getDocs(inProgressQuery)
                    ]);
                    
                    console.log("Available projects count:", availableSnap.size);
                    console.log("Inquired projects count:", inquiredSnap.size);
                    console.log("Pending approval projects count:", pendingApprovalSnap.size);
                    console.log("In Progress projects count:", inProgressSnap.size);
                    
                    // Convert snapshots to arrays with project data
                    const availableProjectsData = availableSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    const inquiredProjectsData = inquiredSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    const pendingApprovalProjectsData = pendingApprovalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    const inProgressProjectsData = inProgressSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    
                    setAvailableProjects(availableProjectsData);
                    setInquiredProjects(inquiredProjectsData);
                    setPendingApprovalProjects(pendingApprovalProjectsData);
                    setInProgressProjects(inProgressProjectsData);
                    setError(null);
                } catch (error) {
                    console.error("Error in queries:", error);
                    setError("Failed to load projects. Please try again later.");
                    setAvailableProjects([]);
                    setInquiredProjects([]);
                    setPendingApprovalProjects([]);
                    setInProgressProjects([]);
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError(err.message);
                setAvailableProjects([]);
                setInquiredProjects([]);
                setPendingApprovalProjects([]);
                setInProgressProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [currentUser, profile]);
    
    const handleViewProject = (projectId) => {
        navigate(`/projects/view/${projectId}`);
    };

    return (
      <>
        <ProfileNav />
        <div className="main-content max-w-6xl mx-auto p-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            <div className="flex flex-col items-center md:col-span-1 text-center p-4 border rounded shadow">
              <h2 className="text-2xl font-bold mt-4">{profile?.username || profile?.firstName || "Contractor"}</h2>
              <img src={defaultProfile} alt="profile" className="w-24 h-24 rounded-full my-2" />
              <p className="text-gray-500">{profile?.email}</p>
              <Link to="/edit-profile">
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
              </Link>
            </div>
            
            <div className="p-4 border rounded shadow md:col-span-2">
              <h3 className="text-lg font-semibold">Quick Stats</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-blue-700 font-medium">{availableProjects.length}</p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-yellow-700 font-medium">{inquiredProjects.length}</p>
                  <p className="text-sm text-gray-600">Inquired</p>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <p className="text-orange-700 font-medium">{pendingApprovalProjects.length}</p>
                  <p className="text-sm text-gray-600">Pending Approval</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-green-700 font-medium">{inProgressProjects.length}</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <Link to="/available-projects">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">Browse All Projects</button>
                </Link>
                <Link to="/messages">
                  <button className="bg-gray-500 text-white px-4 py-2 rounded">Messages</button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Project Sections */}
          {loading ? (
            <div className="text-center mt-8 p-4">Loading projects...</div>
          ) : error ? (
            <div className="text-center mt-8 p-4 text-red-500">{error}</div>
          ) : (
            <div className="mt-8">
              {/* Available Projects Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Available Projects</h2>
                  <Link to="/available-projects" className="text-blue-500 hover:underline">View All</Link>
                </div>
                {availableProjects.length === 0 ? (
                  <p className="text-gray-500">No available projects at the moment.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="border p-4 rounded shadow relative">
                        <div className="absolute top-0 right-0 m-2 px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">New</div>
                        <h3 className="font-semibold mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{project.flooringOption?.title || "Not specified"}</span>
                          <button 
                            onClick={() => handleViewProject(project.id)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Inquired Projects Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Projects You've Inquired About</h2>
                {inquiredProjects.length === 0 ? (
                  <p className="text-gray-500">You haven't inquired about any projects yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inquiredProjects.map((project) => (
                      <div key={project.id} className="border p-4 rounded shadow relative">
                        <div className="absolute top-0 right-0 m-2 px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">Inquired</div>
                        <h3 className="font-semibold mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{project.flooringOption?.title || "Not specified"}</span>
                          <button 
                            onClick={() => handleViewProject(project.id)}
                            className="text-yellow-600 hover:underline text-sm"
                          >
                            View Inquiry
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Pending Approval Projects Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Projects Pending Approval</h2>
                {pendingApprovalProjects.length === 0 ? (
                  <p className="text-gray-500">No projects pending approval.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingApprovalProjects.map((project) => (
                      <div key={project.id} className="border p-4 rounded shadow relative">
                        <div className="absolute top-0 right-0 m-2 px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">Pending Approval</div>
                        <h3 className="font-semibold mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{project.flooringOption?.title || "Not specified"}</span>
                          <button 
                            onClick={() => handleViewProject(project.id)}
                            className="text-orange-600 hover:underline text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* In Progress Projects Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Projects In Progress</h2>
                {inProgressProjects.length === 0 ? (
                  <p className="text-gray-500">No projects in progress.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inProgressProjects.map((project) => (
                      <div key={project.id} className="border p-4 rounded shadow relative">
                        <div className="absolute top-0 right-0 m-2 px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">In Progress</div>
                        <h3 className="font-semibold mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{project.flooringOption?.title || "Not specified"}</span>
                          <button 
                            onClick={() => handleViewProject(project.id)}
                            className="text-green-600 hover:underline text-sm"
                          >
                            View Project
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
};

export default ContractorDashboard;