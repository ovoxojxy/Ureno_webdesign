import { FC } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/Button'
import SignIn from '@/components/SIgnIn'



const page: FC = ({}) => {
 return <div className='absolute inset-0'>
    <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Link to='/' className={cn(buttonVariants({variant: 'ghost'}), 'self-start -mt-20')}>Home</Link>

        <SignIn />
    </div>
 </div>
}

export default SignIn