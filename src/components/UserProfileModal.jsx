import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function UserProfileModal({ userId, isOpen, onClose }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!userId || !isOpen) return;

        const fetchUser = async () => {
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUser(userSnap.data());
                } else {
                    setUser({ displayName: "Unknown", role: "N/A" });
                }
                }catch (err) {
                    console.error("Failed to fetch user: ", err)
                }
            }
            fetchUser();
    }, [userId, isOpen])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">User Profile</h2>
                {user ? (
                    <div>
                        <p><strong>Name:</strong> {user.displayName}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    )
}

export default UserProfileModal