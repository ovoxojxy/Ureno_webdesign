import { Link, useNavigate } from 'react-router-dom'
import { Settings, Bell, LogOut } from 'lucide-react'


const ProfileNav = () => {    
    return (
        <div className="nav flex justify-between items-center p-4 border-b">
            <Link to="/" className='text-2xl font-bold'>
            <div className="logo">URENO</div>
            </Link>

            <div className='flex items-center gap-4 ml-auto'>
                <Link to="/settings" className="flex items-center gap-2 text-gray-600 hover:text-black">
                    <Settings className="w-5 h-5" /> Settings
                </Link>

                <Link to="/notifications" className="flex items-center gap-2 text-gray-600 hover:text-black">
                    <Bell className="w-5 h-5" /> Notifications
                </Link>

                <Link to="/logout" className="flex items-center gap-2 text-red-500 hover:text-red-700">
                    <LogOut className="w-5 h-5" /> Log Out
                </Link>
            </div>
        </div>
            
    )
}

export default ProfileNav