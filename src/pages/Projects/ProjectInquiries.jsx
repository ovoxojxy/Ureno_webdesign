import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useUser } from "@/contexts/authContext/UserContext";
import { createConversation } from "@/pages/Conversation/createConversation";

const ProjectInquiries = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [contractors, setContractors] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiringContractors = async () => {
      try {
        const projectRef = doc(db, "projects", id);
        const projectSnap = await getDoc(projectRef);

        if (!projectSnap.exists()) {
          console.error("Project not found");
          setLoading(false);
          return;
        }

        const projectData = { id: projectSnap.id, ...projectSnap.data() };
        setProject(projectData);
        
        const inquiredBy = projectData.inquiredBy || [];

        const contractorProfiles = await Promise.all(
          inquiredBy.map(async (uid) => {
            const userSnap = await getDoc(doc(db, "users", uid));
            return userSnap.exists() ? { uid, ...userSnap.data() } : null;
          })
        );

        // Filter out duplicates and null values
        const uniqueContractors = [];
        const seenUids = new Set();
        for (const profile of contractorProfiles) {
          if (profile && !seenUids.has(profile.uid)) {
            seenUids.add(profile.uid);
            uniqueContractors.push(profile);
          }
        }
        setContractors(uniqueContractors);
      } catch (err) {
        console.error("Error fetching contractor inquiries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiringContractors();
  }, [id]);

  const handleViewMessage = async (contractorId) => {
    try {
      // Create or get conversation for this contractor and project
      const conversationId = await createConversation({
        projectId: id,
        customerId: user.uid,
        contractorId: contractorId,
        status: "inquiry",
      });

      // Navigate to messages
      navigate("/messages");
    } catch (err) {
      console.error("Error viewing messages:", err);
    }
  };

  const handleAccept = async (contractorId) => {
    try {
      // Update the project with the selected contractor and change status to in progress
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, {
        contractorId,
        status: "in progress",
      });

      // Create/ensure a conversation exists for communication
      await createConversation({
        projectId: id,
        customerId: user.uid,
        contractorId: contractorId,
        status: "in_progress",
      });

      // Update the inquiredBy list to remove the accepted contractor
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        const currentData = projectSnap.data();
        const updatedInquiredBy = (currentData.inquiredBy || []).filter(uid => uid !== contractorId);
        await updateDoc(projectRef, {
          inquiredBy: updatedInquiredBy,
        });
      }

      navigate("/projects");
    } catch (err) {
      console.error("Error accepting contractor:", err);
    }
  };

  const handleRemove = async (contractorId) => {
    try {
      const projectRef = doc(db, "projects", id);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) return;

      const currentData = projectSnap.data();
      const updatedInquiredBy = (currentData.inquiredBy || []).filter(uid => uid !== contractorId);

      await updateDoc(projectRef, {
        inquiredBy: updatedInquiredBy,
      });
      setContractors(prev => prev.filter(c => c.uid !== contractorId));
    } catch (err) {
      console.error("Error removing contractor inquiry:", err);
    }
  };

  if (loading) return <div className="p-4">Loading contractor inquiries...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto mt-24">
      <div className="fixed top-0 left-0 w-full bg-white p-4 flex items-center pb-6 z-10">               
        <Link to="/ProfileDashboard">
          <div className="logo"> return </div>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Contractor Inquiries</h1>
      {project && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-lg">{project.title}</h2>
          <p className="text-sm text-gray-600">{project.description}</p>
        </div>
      )}
      
      {contractors.length === 0 ? (
        <p>No contractor inquiries yet.</p>
      ) : (
        <ul className="space-y-4">
          {contractors.map((contractor) => (
            <li key={contractor.uid} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">
                {contractor.firstName} {contractor.lastName}
              </h2>
              <p className="text-sm text-gray-600">{contractor.email}</p>
              <p className="text-sm text-gray-500">{contractor.role}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleViewMessage(contractor.uid)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  View Message
                </button>
                <button
                  onClick={() => handleAccept(contractor.uid)}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRemove(contractor.uid)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectInquiries;