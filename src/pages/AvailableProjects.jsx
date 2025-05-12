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

      // Fetch both submitted and inquiry status projects
      const submittedQuery = query(
        collection(db, "projects"),
        where("status", "==", "submitted")
      );

      const inquiryQuery = query(
        collection(db, "projects"),
        where("status", "==", "inquiry")
      );

      const [submittedSnapshot, inquirySnapshot] = await Promise.all([
        getDocs(submittedQuery),
        getDocs(inquiryQuery)
      ]);

      console.log("Found projects - Submitted:", submittedSnapshot.docs.length, "Inquiry:", inquirySnapshot.docs.length);

      // Combine both result sets
      const submittedResults = submittedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const inquiryResults = inquirySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const results = [...submittedResults, ...inquiryResults];
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

    return (
        <div className="p-4 max-w-4xl mx-auto mt-20">

          <div className="fixed top-0 left-0 w-full bg-white p-4 flex items-center pb-6 z-10">               
               <Link to="/contractor-dashboard">
                    <div className="logo"> return </div>
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-4">Available Projects</h1>
            {projects.length === 0 ? (
                <p>No Submitted projects found.</p>
            ) : (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                <div key={project.id} className="border p-4 rounded shadow relative">
                  {/* Status indicator */}
                  <div className={`absolute top-0 right-0 m-2 px-2 py-1 text-xs font-semibold rounded ${
                    project.status === "submitted" ? "bg-blue-100 text-blue-800" :
                    project.status === "inquiry" ? "bg-yellow-100 text-yellow-800" :
                    project.status === "in progress" ? "bg-green-100 text-green-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {project.status === "submitted" ? "New" :
                     project.status === "inquiry" ? "Inquired" :
                     project.status === "in progress" ? "In Progress" :
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
                      project.status === "inquiry" && project.inquiredBy?.includes(user.uid)
                      ? "bg-yellow-500" : "bg-blue-600"
                    }`}
                    onClick={() => navigate(`/projects/view/${project.id}`)}
                  >
                    {project.status === "inquiry" && project.inquiredBy?.includes(user.uid)
                      ? "View Inquiry" : "View Project"}
                  </button>
                </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  export default AvailableProjects