// Change use state after sign in
import { FC } from 'react'
import { Icons } from './Icons'
import { Link, useNavigate } from 'react-router-dom'
import UserAuthForm from './UserAuthForm'
import SignInNav from './signinNav'

const SignIn = () => {
    const navigate = useNavigate();

return <div className='flex items-center justify-center h-screen w-full px-4'>
        <div className='w-full max-w-sm space-y-6 text-center'>
        <div className='flex flex-col space-y-2 text-center'>
        <div className='w-full flex justify-center'>
        <button onClick = {() => navigate('/')} aria-label="Go to home">
        <Icons.logo className='h-12 w-auto' />
        </button>
        </div>
        
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>

        {/* sign in form */}

        
        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700">
            New to Ureno?{' '}
            <Link to='/sign-up' className='hover:text-zinc-800 text-sm underline underline-offset-4'>
            Sign Up
            </Link>
        </p>
        <p className='text-sm max-w-xs mx-auto text-gray-500'>
                        By clicking create account, you agree to our <a href="" className='underline'>Terms of Service</a> and <a href="" className='underline'>Privacy Policy</a>
                </p>
    </div>
    </div>
</div>
}

export default SignIn