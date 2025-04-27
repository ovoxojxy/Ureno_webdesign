import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function CreateProject() {
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [flooringType, setFlooringType] = useState("")
    const [length, setLength] = useState("")
    const [width, setWidth] = useState("")
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!currentUser) return

        setLoading(true)

        try {
            const projectRef = collection(db, "users", currentUser.uid, "projects")
            await addDoc(projectRef, {
                ownerId: currentUser.uid,
                title,
                description,
                flooringType,
                roomDimensions: {
                    length: Number(length),
                    width: Number(width),
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: "in progress"
            })

            setShowSuccess(true)
            setTimeout(() => {
                setShowSuccess(false)
                navigate("/projects")
            }, 1500)

            navigate("/projects")
        } catch (error) {
            console.error("Error creating project: ", error)
        } finally {
            setLoading(false)
        }
    }

    return (


        <div className="p-4 max-w-2xl mx-auto mt-20 relative">

            <div className="fixed top-0 left-0 w-full bg-white  p-4 flex items-center">
                <Link to="/projects">
                    <div className="logo"> return </div>
                </Link>
            </div>


            <h1 className="text-2xl font-bold mb-4">Create New Project</h1>

            {showSuccess && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
                    Project created successfully!
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text"
                    placeholder="Project Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border p-2 rounded" />
                
                <textarea 
                    placeholder="Project Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full border p-2 rounded"/>
                
                <input
                    type="text"
                    placeholder="Flooring Type"
                    value={flooringType}
                    onChange={(e) => setFlooringType(e.target.value)}
                    className="w-full border p-2 rounded"
                    />

                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Length (ft)"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Width (ft)"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <button
                 type="submit"
                 disabled={loading}
                 className="px-4 py-2 bg-blue-500 text-white rounded"
                 >
                    {loading ? "Creating..." : "Create Project"}
                 </button>
            </form>
        </div>
    )
}

export default CreateProject