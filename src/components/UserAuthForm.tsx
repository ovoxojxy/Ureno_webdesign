import { FC, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Icons } from './Icons'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'
import SignIn from './SignIn'
import { signInWithPopup, auth, provider  } from "../firebase/firebaseConfig"
import { useToast } from '@/hooks/use-toast'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth"
import { useAuth } from '@/contexts/authContext'


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}



const UserAuthForm: FC<UserAuthFormProps> = ({className, ...props}) => {
    const { userLoggedIn } = useAuth() || { userLoggedIn: false }


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {toast} = useToast()

    const loginWithGoogle = async () => {
        setIsLoading(true)

        try {
            const result = await doSignInWithGoogle()
        } catch (error){
            // toast notification
            toast({
                title: 'THere was a problem.',
                description: 'THere was an error logging in with Google',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    };

    const loginWithEmailAndPassword = async (email: string, password: string) => {
        setIsLoading(true)

        try {
            const result = await doSignInWithEmailAndPassword(email, password)

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
        }
    }

   
 return (
    <div className={cn('flex flex-col items-center space-y-4 justify-center', className)} {...props}>
        {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
        <div className="flex flex-col space-y-2">
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
        </div>

        <p> Or Login with Google</p>
        <Button 
            onClick={loginWithGoogle} 
            isLoading={isLoading} 
            size='sm' 
            className='w-full max-w-md'> 
            {isLoading ? null : <Icons.google className='h-4 w-4 mr-2'/>}
            Google
        </Button>
    </div>

 )
    
}

export default UserAuthForm