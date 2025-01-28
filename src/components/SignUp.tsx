import { FC } from "react";
import { Link } from "react-router-dom";
import { Icons } from "./Icons";
import Register from "./register";

const SignUp = () => {
    return<div className='container mx-auto flex h-screen w-full flex-col justify-center space-y-6 sm:w-[400px]'>
    <div className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='container mx-auto flex h-screen w-full flex-col justify-center' />
                <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
                <p className='text-sm max-w-xs mx-auto'>
                    "Sample User Agreement"
                </p>

                <Register />
                </div>
            </div>
}

export default SignUp