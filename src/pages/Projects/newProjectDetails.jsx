import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useUser } from "@/contexts/authContext/UserContext";
import { Link } from "react-router-dom";

import { createConversation } from "@/pages/Conversation/createConversation";

const NewProjectDetails = () => {
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

        const handleViewConversation = async () => {
          try {
            const conversationId = await createConversation({
              projectId,
              customerId: project.ownerId,
              contractorId: user.uid,
              status: project.status,
            });
            
            navigate("/messages");
          } catch (err) {
            console.error("Error accessing conversation:", err.message);
          }
        };
      
        const handleAccept = async () => {
            try {
                console.log("🔍 Attempting to request acceptance...");

                // Log project data
                console.log("📝 Project object before update:", project);

                // Log user info
                console.log("👤 User UID:", user?.uid);
                console.log("👤 User Role:", profile?.role);

                // Prepare new data to update
                const updateData = {
                    status: "pending_approval",
                    requestedBy: [...(project.requestedBy || []), user.uid],
                };

                console.log("📦 Data to be sent in updateDoc:", updateData);

                // Send update
                const docRef = doc(db, "projects", projectId);
                await updateDoc(docRef, updateData);

                console.log("✅ Project updated successfully!");
                navigate("/contractor-dashboard");
            } catch (err) {
                console.error("❌ Error requesting acceptance:", err.message);
            }
        };
      
        if (loading) return <div>Loading project...</div>;
        if (!project) return <div>Project not found.</div>;
      
        return (
          <div className="p-6 max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">

            <div className="fixed top-0 left-0 w-full bg-white p-4 flex items-center pb-6 z-10">               
                    <div className="logo cursor-pointer" onClick={() => navigate(-1)}> return </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">{project.title}</h1>

            <div className="border rounded-lg p-6 shadow-md mb-6 max-w-2xl bg-white">
              <h2 className="text-xl font-semibold mb-4">Project Summary</h2>
              <p className="mb-2">
                <strong>Submitted by:</strong> {project.ownerDisplayName || "Unknown"}
              </p>
              <p className="mb-2"><strong>Type:</strong> {project.type || "Not specified"}</p>

              {project.flooringOption && (
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={project.flooringOption.image}
                    alt={project.flooringOption.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium"><span role="img" aria-label="floor" className="mr-2">🪵</span>{project.flooringOption.title}</p>
                    <p className="text-green-600 font-semibold">
                      ${project.flooringOption.price?.toFixed(2)} /sqft
                    </p>
                  </div>
                </div>
              )}

              {project.paintOption && (
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={project.paintOption.image}
                    alt={project.paintOption.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium"><span role="img" aria-label="paint" className="mr-2">🎨</span>{project.paintOption.name}</p>
                    <p className="text-green-600">Paint Color</p>
                  </div>
                </div>
              )}

              <p className="mb-1">
                <strong>Room Size:</strong> {project.roomDimensions?.length} ft × {project.roomDimensions?.width} ft (
                {project.roomDimensions?.length * project.roomDimensions?.width} sqft)
              </p>

              <p className="mb-1">
                <strong>Project Timeline:</strong> {project.startDate || "Not specified"}
              </p>
            </div>
            </div>
      
            {profile?.role === "contractor" && (
              <div className="mt-6 flex gap-4 max-w-xs justify-center items-center">
                {project.status === "in progress" && project.contractorId === user.uid ? (
                  <button
                    onClick={handleViewConversation}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Conversation
                  </button>
                ) : project.status === "pending_approval" && project.requestedBy?.includes(user.uid) ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-orange-100 border border-orange-300 text-orange-800 px-4 py-2 rounded-lg text-center">
                      <div className="font-semibold">Pending Acceptance</div>
                      <div className="text-sm">Waiting for homeowner approval</div>
                    </div>
                    <button
                      onClick={handleViewConversation}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Message Homeowner
                    </button>
                  </div>
                ) : project.status === "inquiry" && project.inquiredBy?.includes(user.uid) ? (
                  <>
                    <button
                      onClick={handleViewConversation}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      View Conversation
                    </button>
                    <button
                      onClick={handleAccept}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                      disabled={project.requestedBy?.includes(user.uid)}
                    >
                      Request Acceptance
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleInquire}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                      disabled={project.inquiredBy?.includes(user.uid)}
                    >
                      Inquire
                    </button>
                    <button
                      onClick={handleAccept}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                      disabled={project.requestedBy?.includes(user.uid)}
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
      
      export default NewProjectDetails;