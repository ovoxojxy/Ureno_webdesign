import { collection, query, where, getDocs } from "firebase/firestore";

export const fetchContractorReviews = async (contractorId) => {
    try {
        const q = query(
            collection(db, "reviews"),
            where("contractorId", "==", contractorId)
        )

        const snapshot = await getDocs(q)
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        return reviews
    } catch (error) {
        console.error("❌ Error fetching reviews:", error.message)
        return []
    }
}