import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useUser } from "@/contexts/authContext/UserContext";
import { Link } from "react-router-dom";

import { createConversation } from "@/pages/Conversation/createConversation";

const ProjectDetails = () => {
    const { projectId } = useParams();
    console.log("Project ID from URL:", projectId);
    const navigate = useNavigate();
    const { profile, user } = useUser();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) {
                console.error("No project ID provided in URL");
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, "projects", projectId);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    // Use the correct ID property (snap.id, not snap.projectId)
                    setProject({ id: snap.id, ...snap.data() });
                }
            } catch (err) {
              console.error("Error fetching project:", err.message);
            } finally {
              setLoading(false);
            }
          };
          fetchProject();
        }, [projectId]);
      
        const handleInquire = async () => {
          try {
            const docRef = doc(db, "projects", projectId);
            await updateDoc(docRef, {
              status: "inquiry",
              inquiredBy: [...(project.inquiredBy || []), user.uid],
            });
        
            const conversationId = await createConversation({
              projectId,
              customerId: project.ownerId,
              contractorId: user.uid,
              status: "inquiry",
            });
        
            // navigate(`/messages/${conversationId}`);
            navigate("/messages");
          } catch (err) {
            console.error("Error inquiring about project:", err.message);
          }
        };
      
        const handleAccept = async () => {
          try {
            const docRef = doc(db, "projects", projectId);
            await updateDoc(docRef, {
              // status: "in progress",
              // contractorId: user.uid,
              status: "pending_approval",
              requestedBy: [...(project.requestedBy || []), user.uid],
            });
            navigate("/contractor-dashboard");
          } catch (err) {
            // console.error("Error accepting project:", err.message);
            console.error("Error requestin acceptance:", err.message);
          }
        };
      
        if (loading) return <div>Loading project...</div>;
        if (!project) return <div>Project not found.</div>;
      
        return (
          <div className="p-6 max-w-4xl mx-auto mt-24">

            <div className="fixed top-0 left-0 w-full bg-white p-4 flex items-center pb-6 z-10">               
                    <div className="logo cursor-pointer" onClick={() => navigate(-1)}> return </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <p>Material: {project.flooringOption?.title}</p>
            <p>
              Area: {project.roomDimensions?.length} x {project.roomDimensions?.width} ft
            </p>
      
            {profile?.role === "contractor" && (
              <div className="mt-6 flex gap-4">
                {project.status === "in progress" && project.contractorId === user.uid ? (
                  <button
                    onClick={() => navigate('/messages/')}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Conversation
                  </button>
                ) : project.status === "inquiry" && project.inquiredBy?.includes(user.uid) ? (
                  <>
                    <button
                      onClick={() => navigate('/messages/')}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      View Conversation
                    </button>
                    <button
                      onClick={handleAccept}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Request Acceptance
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleInquire}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Inquire
                    </button>
                    <button
                      onClick={handleAccept}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Request Acceptance
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      };
      
      export default ProjectDetails;