import { FC, useState } from 'react'
import { Icons } from './Icons'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'
import SignIn from './SignIn'
import { signInWithPopup, auth, provider  } from "../firebaseConfig"



interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}



const UserAuthForm: FC<UserAuthFormProps> = ({className, ...props}) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const loginWithGoogle = async () => {
        setIsLoading(true)

        try {
            const result = await signInWithPopup(auth, provider)
        } catch (error){
            // toast notification
        } finally {
            setIsLoading(false)
        }
    }

   
 return (
    <div className={cn('flex justify-center', className)} {...props}>
        <Button onClick={loginWithGoogle} isLoading={isLoading} size='sm' className='w-full'> {isLoading ? null : <Icons.google className='h-4 w-4 mr-2'/>}Google</Button>
    </div>

 )
    
}

export default UserAuthForm