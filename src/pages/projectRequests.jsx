import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const ProjectRequests = () => {
  const { id } = useParams();
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestedContractors = async () => {
      try {
        const projectRef = doc(db, "projects", id);
        const projectSnap = await getDoc(projectRef);

        if (!projectSnap.exists()) {
          console.error("Project not found");
          setLoading(false);
          return;
        }

        const projectData = projectSnap.data();
        const requestedBy = projectData.requestedBy || [];

        const contractorProfiles = await Promise.all(
          requestedBy.map(async (uid) => {
            const userSnap = await getDoc(doc(db, "users", uid));
            return userSnap.exists() ? { uid, ...userSnap.data() } : null;
          })
        );

        setContractors(contractorProfiles.filter(Boolean));
      } catch (err) {
        console.error("Error fetching contractor requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestedContractors();
  }, [id]);

  const handleApprove = async (contractorId) => {
    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, {
        contractorId,
        status: "in progress",
      });
      // Remove approved contractor from requestedBy list
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        const currentData = projectSnap.data();
        const updatedRequestedBy = (currentData.requestedBy || []).filter(uid => uid !== contractorId);
        await updateDoc(projectRef, {
          requestedBy: updatedRequestedBy,
        });
        setContractors(prev => prev.filter(c => c.uid !== contractorId));
      }
    } catch (err) {
      console.error("Error approving contractor:", err);
    }
  };

  const handleDeny = async (contractorId) => {
    try {
      const projectRef = doc(db, "projects", id);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) return;

      const currentData = projectSnap.data();
      const updatedRequestedBy = (currentData.requestedBy || []).filter(uid => uid !== contractorId);

      await updateDoc(projectRef, {
        requestedBy: updatedRequestedBy,
      });
      setContractors(prev => prev.filter(c => c.uid !== contractorId));
    } catch (err) {
      console.error("Error denying contractor:", err);
    }
  };

  if (loading) return <div className="p-4">Loading contractor requests...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contractor Requests</h1>
      {contractors.length === 0 ? (
        <p>No contractor requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {contractors.map((contractor) => (
            <li key={contractor.uid} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">
                {contractor.firstName} {contractor.lastName}
              </h2>
              <p className="text-sm text-gray-600">{contractor.email}</p>
              <p className="text-sm text-gray-500">{contractor.role}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleApprove(contractor.uid)}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDeny(contractor.uid)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Deny
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectRequests;
