import { useEffect, useState } from "react";
import { collection, getDocs, query, where, collectionGroup } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useUser } from "@/contexts/authContext/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AvailableProjects = () => {
    const { profile, user } = useUser();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
  const fetchProjects = async () => {
    try {
      if (!profile || !user || profile.role !== "contractor") {
        setLoading(false);
        return;
      }

      console.log("Fetching projects for contractor:", user.uid);

      // Fetch submitted, inquiry, in progress (for this contractor), and pending_approval projects
      const submittedQuery = query(
        collection(db, "projects"),
        where("status", "==", "submitted")
      );

      const inquiryQuery = query(
        collection(db, "projects"),
        where("status", "==", "inquiry")
      );

      const inProgressQuery = query(
        collection(db, "projects"),
        where("status", "==", "in progress"),
        where("contractorId", "==", user.uid)
      );

      const pendingApprovalQuery = query(
        collection(db, "projects"),
        where("status", "==", "pending_approval"),
        where("requestedBy", "array-contains", user.uid)
      );

      const [submittedSnapshot, inquirySnapshot, inProgressSnapshot, pendingApprovalSnapshot] = await Promise.all([
        getDocs(submittedQuery),
        getDocs(inquiryQuery),
        getDocs(inProgressQuery),
        getDocs(pendingApprovalQuery)
      ]);

      const submittedResults = submittedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const inquiryResults = inquirySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const inProgressResults = inProgressSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const pendingApprovalResults = pendingApprovalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const results = [...submittedResults, ...inquiryResults, ...inProgressResults, ...pendingApprovalResults];
      setProjects(results);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProjects();
}, [profile, user]);

    if (loading) return <div>Loading...</div>

    const acceptedProjects = projects.filter(p => p.status === "in progress" && p.contractorId === user.uid);
    const availableProjects = projects.filter(p => !(p.status === "in progress" && p.contractorId === user.uid));

    return (
        <div className="p-4 max-w-4xl mx-auto mt-20">

          <div className="fixed top-0 left-0 w-full bg-white p-4 flex items-center pb-6 z-10">               
                    <div className="logo cursor-pointer" onClick={() => navigate(-1)}> return </div>
            </div>

            {acceptedProjects.length > 0 && (
              <>
                <h1 className="text-2xl font-bold mb-4">Accepted Projects</h1>
                <div className="mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {acceptedProjects.map((project) => (
                      <div key={project.id} className="border p-4 rounded shadow relative bg-green-50">
                        <div className="absolute top-0 right-0 m-2 px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                          In Progress
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                        <p className="text-gray-600 mb-1">{project.description}</p>
                        <p className="text-sm">Material: {project.flooringOption?.title}</p>
                        <p className="text-sm">
                          Area: {project.roomDimensions?.length} ft x {project.roomDimensions?.width} ft
                        </p>
                        <button
                          className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
                          onClick={() => navigate(`/projects/view/${project.id}`)}
                        >
                          View Project
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <h1 className="text-2xl font-bold mb-4">Available Projects</h1>

            {availableProjects.length === 0 ? (
                <p>No Submitted projects found.</p>
            ) : (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableProjects.map((project) => (
                <div key={project.id} className="border p-4 rounded shadow relative">
                  {/* Status indicator */}
                  <div className={`absolute top-0 right-0 m-2 px-2 py-1 text-xs font-semibold rounded ${
                    project.status === "submitted" ? "bg-blue-100 text-blue-800" :
                    project.status === "inquiry" ? "bg-yellow-100 text-yellow-800" :
                    project.status === "in progress" ? "bg-green-100 text-green-800" :
                    project.status === "pending_approval" ? "bg-orange-100 text-orange-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {project.status === "submitted" ? "New" :
                     project.status === "inquiry" ? "Inquired" :
                     project.status === "in progress" ? "In Progress" :
                     project.status === "pending_approval" ? "Pending Approval" :
                     project.status}
                  </div>

                  <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                  <p className="text-gray-600 mb-1">{project.description}</p>
                  <p className="text-sm">Material: {project.flooringOption?.title}</p>
                  <p className="text-sm">
                    Area: {project.roomDimensions?.length} ft x {project.roomDimensions?.width} ft
                  </p>

                  {/* Conditional button based on status */}
                  <button
                    className={`mt-3 px-4 py-2 text-white rounded ${
                      project.status === "pending_approval" && project.requestedBy?.includes(user.uid)
                        ? "bg-orange-500"
                        : project.status === "inquiry" && project.inquiredBy?.includes(user.uid)
                        ? "bg-yellow-500"
                        : "bg-blue-600"
                    }`}
                    onClick={() => navigate(`/projects/view/${project.id}`)}
                  >
                    {project.status === "pending_approval" && project.requestedBy?.includes(user.uid)
                      ? "Awaiting Customer Approval"
                      : project.status === "inquiry" && project.inquiredBy?.includes(user.uid)
                      ? "View Inquiry"
                      : project.status === "pending homeowner approval" && project.contractorId === user.uid
                        ? "Pending Approval"
                        : "View Project"}
                  </button>
                </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  export default AvailableProjects