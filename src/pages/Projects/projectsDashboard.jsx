import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

import { setPriority } from "firebase/database";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

function ProjectsDashboard() {
    const { currentUser } = useAuth();
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [openDropdownId, setOpenDropdownId] = useState(null)

    const handleToggleOptions = (projectId) => {
      setOpenDropdownId(prev => (prev === projectId ? null : projectId))
    }

    const handleDelete = async (projectId) => {
        if (!currentUser) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;

        try {
            // Delete from the root-level projects collection to match where we're fetching from
            const docRef = doc(db, "projects", projectId);
            await deleteDoc(docRef);
            setProjects(prev => prev.filter(p => p.id !== projectId));
            console.log("Project deleted successfully");
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Failed to delete project. Please try again.");
        }
    }


    useEffect(() => {
        const fetchProjects = async () => {
            if (!currentUser) return;

            const projectsRef = collection(db, "projects")
            const q = query(projectsRef, where("ownerId", "==", currentUser.uid))
            const querySnapshot = await getDocs(q)

            const userProjects = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setProjects(userProjects);
            setLoading(false)
        }
        fetchProjects()
    }, [currentUser])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="p-4  relative">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Button className="text-blue-500 text-3xl font-bold hover:scale-110 hover:text-blue-700 transition-all duration-200 flex items-center justify-center" onClick={() => navigate(-1)}>&lt;</Button>

                        <h1 className="text-2xl font-bold">My Projects</h1>
                    </div>
                    <Link to="/projects/new">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded">
                            Create New Project
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map(project => (
                        <div key={project.id} className="p-4 border rounded shadow">
                            <div className="flex justify-between items-center mb-2">
                              <h2 className="text-xl font-semibold">{project.title}</h2>
                              <span className="text-sm text-white px-2 py-1 rounded bg-gray-500">
                                {project.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-start">
                                <div></div>
                                <div className="relative">
                                    <button onClick={() => handleToggleOptions(project.id)} className="text-gray-600 hover:text-black">⋮</button>
                                    {openDropdownId === project.id && (
                                      <div className="absolute right-0 mt-1 bg-white border rounded shadow-md z-10">
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                                        >
                                            Delete
                                        </button>
                                        <Link
                                            to={`/projects/edit/${project.id}`}
                                            className="block px-4 py-2 hover:bg-blue-100 text-blue-600"
                                        >
                                            Edit
                                        </Link>
                                      </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-600">{project.description}</p>
                            {project.status === "inquiry" && project.inquiredBy?.length > 0 && (
                              <Link to={`/projects/${project.id}/inquiries`}>
                                <button className="mt-2 text-blue-600 hover:underline">
                                  View Inquiries
                                </button>
                              </Link>
                            )}
                            {project.status === "pending_approval" && project.requestedBy?.length > 0 && (
                              <Link to={`/projects/${project.id}/requests`}>
                                <button className="mt-2 text-blue-600 hover:underline">
                                  View Requests
                                </button>
                              </Link>
                            )}
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ProjectsDashboard
