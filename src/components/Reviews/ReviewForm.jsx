import React, {useState, useEffect} from "react";
import { submitReview } from "./submitReview";
import { hasAlreadyReviewed } from "./preventDupe";
import { useUser } from "@/contexts/authContext/UserContext";

const ReviewForm = ({ contractorId, projectId }) => {
    const { user } = useUser()
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")
    const [hasReviewed, setHasReviewed] = useState(false)

    useEffect(() => {
        const checkReview = async () => {
            if (user?.uid) {
                const alreadyReviewed = await hasAlreadyReviewed(user.uid, projectId)
                setHasReviewed(alreadyReviewed)
            }
        }
        checkReview()
    }, [user, projectId])

    const handleSubmit = async (e) => {
        e.preventDefault
        if (!rating) {
            setError("Please select a star rating.")
            return
        }

        try {
            await submitReview({ 
                contractorId,
                customerId: user.uid,
                projectId,
                rating,
                comment,
            })
            setSubmitted(true)
        } catch (err) {
            console.error("Submit failed:", err)
            setError("Something went wrong.")
        }
    }

    if (hasReviewed) return <p>You have already submitted a review for this project.</p>
    if (submitted) return <p>Thanks for your feedback!</p>

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Rating:</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`px-3 py-1 rounded ${rating >= star ? "bg-yellow-400" : "bg-gray-200"}`}
            >
              {star} ⭐
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium">Comment:</label>
        <textarea
          className="w-full border rounded p-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional feedback..."
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Review
      </button>
    </form>
    )
}

export default ReviewForm;