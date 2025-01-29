import { FC } from 'react'
import { Icons } from './Icons'
import { Link } from 'react-router-dom'
import UserAuthForm from './UserAuthForm'
import SignInNav from './signinNav'

const SignIn = () => {
return 

<div className='container mx-auto flex h-screen w-full flex-col justify-center space-y-6 sm:w-[400px]'>
    <div className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='container mx-auto flex h-screen w-full flex-col justify-center' />
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
}

export default SignIn