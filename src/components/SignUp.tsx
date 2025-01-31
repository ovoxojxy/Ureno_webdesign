// change use state after sign up
// add email verification / phone number verification


import { FC } from "react";
import { Link } from "react-router-dom";
import { Icons } from "./Icons";
import Register from "./register";

const SignUp = () => {
    return<div className='container mx-auto flex h-screen w-full flex-col justify-center space-y-6 sm:w-[400px]'>
    <div className='flex flex-col space-y-2 text-center'>
        <Register />
        </div>
    </div>
}

export default SignUp