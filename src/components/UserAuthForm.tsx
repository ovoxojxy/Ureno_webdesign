import { FC, useEffect, useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { Icons } from './Icons'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth"
import { useAuth } from '@/contexts/authContext/index'
import { redirect } from 'react-router-dom'


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}



const UserAuthForm: FC<UserAuthFormProps> = ({className, ...props}) => {
    const { userLoggedIn } = useAuth() || { userLoggedIn: false }
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {toast} = useToast()

    useEffect(() => {
        console.log("Auth state changed: userLoggedIn = ", userLoggedIn)
        if (userLoggedIn) {
            navigate("/")
        }
    }, [userLoggedIn, navigate])

    const loginWithGoogle = async () => {
        setIsLoading(true)

        try {
            const result = await doSignInWithGoogle()
            navigate("/")
        } catch (error){
            // toast notification
            toast({
                title: 'THere was a problem.',
                description: 'THere was an error logging in with Google',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
            console.log("Logged in: ", userLoggedIn)
        }
    };

    const loginWithEmailAndPassword = async (email: string, password: string) => {
        setIsLoading(true)

        try {
            const result = await doSignInWithEmailAndPassword(email, password)
            navigate("/")
            toast({
                title: 'Success!',
                description: 'Logged in',
                variant: 'default',
            })
        } catch (error: any) {
            toast({
                title: 'There was a problem.',
                description: 'Error logging in with email and password',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
            console.log("Logged in: ", userLoggedIn)
        }
    }


   
 return (
    <div className={cn('flex flex-col items-center space-y-4 justify-center', className)} {...props}>
        {/* {userLoggedIn && (<Navigate to={'/'} replace={true} />)} */}
        <div className="flex flex-col space-y-4">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                placeholder="Email"
                className="input"
            />

            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className='input'
            />

            <Button
                onClick={() => loginWithEmailAndPassword(email, password)}
                isLoading={isLoading}
                size="sm"
                className='w-full'
            >
                Login with Email
            </Button>

            <p className='flex items-center text-gray-500 text-sm'> 
                <span className='flex-grow border-t border-gray-300'></span>
                <span className='px-3'> Or Login with Google </span>
                <span className='flex-grow border-t border-gray-300'></span>
            </p>
        <Button 
            onClick={loginWithGoogle} 
            isLoading={isLoading} 
            size='sm' 
            className='w-full'> 
            {isLoading ? null : <Icons.google className='sh-4 w-4 mr-2'/>}
            Google
        </Button>
        </div>
    </div>

 )
    
}

export default UserAuthForm