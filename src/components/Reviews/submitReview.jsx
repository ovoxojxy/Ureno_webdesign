import { collection,  addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export const submitReview = async ({ contractorId, customerId, projectId, rating, comment }) => {
    try {
        await addDoc(collection(db, "reviews"), {
            contracotrId, 
            customerId,
            projectId,
            rating,
            comment,
            createdAt: serverTimestamp(),
        })
        console.log("✅ Review submitted")
    } catch (error) {
        console.error("❌ Error submitting review:", error.message)
    }
}