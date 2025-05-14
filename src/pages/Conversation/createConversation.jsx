import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig"

export const createConversation = async ({ 
    projectId,
    customerId,
    contractorId,
    status = "inquiry",
}) => {
    const conversationId = `${projectId}_${contractorId}`
    const convRef = doc(db, "conversations", conversationId)
    const existing = await getDoc(convRef);

    if (!existing.exists()) {
        await setDoc(convRef, {
            projectId,
            customerId,
            contractorId,
            participants: [customerId, contractorId],
            status,
            createdAt: serverTimestamp(),
        })
    }
    return conversationId;
}