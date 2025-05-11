import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { useAuth } from '@/contexts/authContext'

const EditProject = () => {
    const  {projectId} = useParams()
    const  {currentUser} = useAuth()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            if (!currentUser) return
            const docRef = doc(db, 'users', currentUser.uid, 'projects', projectId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setProject({ id: docSnap.id, ...docSnap.data() })
            } 
            setLoading(false)
        }
        fetchProject()
    }, [currentUser, projectId])

    const handleUpdate = async (e) => {
        e.preventDefault()
        const docRef = doc(db, 'users', currentUser.uid, 'projects', projectId)
        await updateDoc(docRef, {
            title: project.title,
            description: project.description
        })
        navigate('/projects')
    }

    if (loading) return <div>Loading...</div>
    if (!project) return <div>Project not found</div>

    return (
        <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          type="text"
          value={project.title}
          onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Project Title"
          className="border p-2 rounded"
        />
        <textarea
          value={project.description}
          onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Project Description"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Project
        </button>
      </form>
    </div>
    )
}

export default EditProject