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

      const q = query(
        collection(db, "projects"),
        where("status", "==", "submitted")
      );

      const snapShot = await getDocs(q);
      console.log("CollectionGroup query returned", snapShot.docs.length, "projects");

      const results = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
                <div key={project.id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-1">{project.description}</p>
                <p className="text-sm">Material: {project.flooringOption?.title}</p>
                <p className="text-sm">
                  Area: {project.roomDimensions?.length} ft x {project.roomDimensions?.width} ft
                </p>
                <button
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => navigate(`/projects/view/${project.id}`)}
                >
                  View Project
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  export default AvailableProjects