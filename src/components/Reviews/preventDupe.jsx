import { collection, query, where, getDocs } from "firebase/firestore"

export const hasAlreadyReviewed = async (customerId, projectId) => {
    const q = query(
        collection(db, "reviews"),
        where("customerId", "==", customerId),
        where("projectId", "==", projectId)
    )
    const snapshot = await getDocs(q)
    return !snapshot.empty
}