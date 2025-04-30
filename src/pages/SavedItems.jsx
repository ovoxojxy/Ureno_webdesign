import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/contexts/authContext";
import { Link } from "react-router-dom";

export default function SavedItems() {
    const { currentUser } = useAuth();
    const [savedMaterials, setSavedMaterials ] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSavedMaterials = async () => {
            if (!currentUser) return

            const savedMaterialsRef = collection(db, "savedMaterials")
            const q = query(savedMaterialsRef, where("userId", "==", currentUser.uid))

            try {
                const querySnapshot = await getDocs(q);
                const materials = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setSavedMaterials(materials)
            } catch (error) {
                console.error("Error fetching saved materials:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSavedMaterials()
    }, [currentUser])

    if (loading) return <div>Loading saved materials...</div>

    return (
        <div className="p-4 max-w-6xl mx-auto">


            <div className="flex items-center gap-3">
                <Link to="/ProfileDashboard" className="text-blue-500 text-3xl font-bold hover:scale-110 hover:text-blue-700 transition-all duration-200 flex items-center justify-center">&lt;</Link>
                <h1 className="text-2xl font-bold">Saved Items</h1>
            </div>
                    
    
          {savedMaterials.length === 0 ? (
            <p className="text-gray-500">You don't have any saved materials yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedMaterials.map(material => (
                <div key={material.id} className="border p-4 rounded shadow">
                  {material.materialImageURL && (
                    <img src={material.materialImageURL} alt={material.materialName} className="w-full h-32 object-cover rounded mb-2" />
                  )}
                  <h2 className="text-xl font-semibold">{material.materialName}</h2>
                  <p className="text-gray-600">{material.materialType}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }