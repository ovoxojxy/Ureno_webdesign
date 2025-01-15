import { FC, useState } from 'react'
import { Icons } from './Icons'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'
import SignIn from './SignIn'
import { signInWithPopup, auth, provider  } from "../firebaseConfig"
import { useToast } from '@/hooks/use-toast'



interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}



const UserAuthForm: FC<UserAuthFormProps> = ({className, ...props}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {toast} = useToast()

    const loginWithGoogle = async () => {
        setIsLoading(true)

        try {
            const result = await signInWithPopup(auth, provider)
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
    }

   
 return (
    <div className={cn('flex justify-center', className)} {...props}>
        <Button 
            onClick={loginWithGoogle} 
            isLoading={isLoading} 
            size='sm' 
            className='w-full'> 
            {isLoading ? null : <Icons.google className='h-4 w-4 mr-2'/>}
            Google
        </Button>
    </div>

 )
    
}

export default UserAuthForm