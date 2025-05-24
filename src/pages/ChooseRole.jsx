import { useContext } from 'react'
import { UserContext } from '@/contexts/authContext/UserContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'

const ChooseRole = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    const setRole = async (role) => {
        if (!user?.uid) return
        try {
            await updateDoc(doc(db, 'users', user.uid), {
              role,
              ...(role === 'contractor' &&  { rating: 0, reviewCount:0 })
            })

            // Redirect to the appropriate dashboard based on role
            if (role === 'contractor') {
                navigate('/contractor-dashboard')
            } else {
                navigate('/')
            }
        } catch (error) {
            console.error('Failed to update role:', error)
        }
    }

    return(
        <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h1 className="text-2xl font-bold mb-6">Are you a contractor or homeowner?</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setRole('contractor')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
        >
          I'm a Contractor
        </button>
        <button
          onClick={() => setRole('customer')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
        >
          I'm a Homeowner
        </button>
      </div>
    </div>
    )
}

export default ChooseRole