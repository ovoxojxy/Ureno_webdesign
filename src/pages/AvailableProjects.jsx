import { useEffect } from "react";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useUser } from "@/contexts/authContext/UserContext";
import { useNavigate } from "react-router-dom";

const AvailableProjects = () => {
    const { profile } = useUser();
    const nacvigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            if (profile?.role !== "contractor") return;
            const q = query(
                collectionGrop(db, "projects"),
                where("status", "==", "available"),
            )
            const snapShot = await getDocs(q);
            const results = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(results);
            setLoading(false);
        }
        fetchProjects();
    }, [profile]);

    if (loading) return <div>Loading...</div>

    return (
        <div className="p-4 max-w-4xl mx-auto mt-20">
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
                  onClick={() => navigate(`/projects/${project.id}`)}
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