import React, { FC, useEffect, useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '@/firebase/auth'
import { Button } from './ui/Button'
import { Icons } from './Icons'



const Register = () => {
    const navigate = useNavigate()
    const {userLoggedIn, loading } = useAuth()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastname] = useState('')
    const [phoneNumber, setNumber] = useState('')
    const [redirectAfterAuth, setRedirectAfterAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if(isRegistering) return 
            
        setErrorMessage('')
        setIsRegistering(true)

        if (password !== confirmPassword) {
            setErrorMessage("Passwords don't match")
            setIsRegistering(false)
            return
        }

        try {
            await doCreateUserWithEmailAndPassword(email, password)
            navigate('/')
            console.log(userLoggedIn)
        } catch (e) {
            setErrorMessage("There was a problem creating your account")
            setIsRegistering(false)
        }
    }

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

    useEffect(() => {
        if (redirectAfterAuth) {
            navigate('/')
            setRedirectAfterAuth(false)
        }
    }, [redirectAfterAuth, navigate, setRedirectAfterAuth])


    const createAccount = async () => {
        try {
            if (password === confirmPassword){
                await doCreateUserWithEmailAndPassword(email, password )
            } else {
                setErrorMessage("Passwords don't match")
            }
        } catch (e) {
            setErrorMessage("There was a aproblem creating you account")
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }


    return(
        <>
        {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
        <main className='w-full h-screen flex self-center place-content-center place-items-center'>
            <div className="w-96 text-gray-600 space-y-5 p-4">
                <div className="text-center mb-6">
                    <div className="mt-2">
                        <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Account Information</h3>
                        <p>Enter your information to sign up</p>
                    </div>

                </div>

                <form
                    onSubmit={onSubmit}
                    className='space-y-4'>

                    {errorMessage && <span className='text-red-600 font-bold'>{errorMessage}</span>}

                        
                        <div>
                            <label className='text-sm text-gray-600 font-bold'>
                            </label>

                            <input 
                                type="text" 
                                autoComplete='given-name'
                                placeholder='First Name'
                                required
                                value={firstName} onChange={(e) => {setFirstName(e.target.value) }}
                                className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300'
                            />
                        </div>

                        <div>
                            <label className='text-sm text-gray-600 font-bold'>
                            </label>

                            <input 
                                type="text" 
                                autoComplete='family-name'
                                placeholder='Last Name'
                                required
                                value={lastName} onChange={(e) => {setLastname(e.target.value) }}
                                className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300'
                            />
                        </div>
                        
                        <div>
                            <label className='text-sm text-gray-600 font-bold'>
                            </label>

                            <input 
                                type="tel" 
                                autoComplete='mobile'
                                placeholder='Phone Number'
                                required
                                value={phoneNumber} onChange={(e) => {setNumber(e.target.value) }}
                                className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300'
                            />
                        </div>

                        <div>
                            <label className='text-sm text-gray-600 font-bold'>
                            </label>

                            <input 
                                type="email" 
                                autoComplete='email'
                                placeholder='Email'
                                required
                                value={email} onChange={(e) => {setEmail(e.target.value) }}
                                className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300'
                            />
                        </div>


                        {/*  Add error handling for passwords less than 6 characters */}
                        <div>
                            <label className='text-sm text-gray-600 font-bold'>
                            </label>
                            <input 
                                type="password" 
                                autoComplete='new-password'
                                placeholder='Password'
                                required
                                value={password} onChange={(e) => {setPassword(e.target.value) }}
                                className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300'
                            />
                        </div>
                        <div>
                            <label className='text-sm text-gray-600 font-bold'>

                            </label>

                            <input 
                                disabled={isRegistering}
                                type='password'
                                autoComplete='off'
                                placeholder='Confirm Password'
                                required
                                value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value)}}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-black shadow-sm rounded-lg transition duration-300"
                            />
                        </div>
                        {/*  Add error handling for passwords less than 6 characters */}




                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}
                            
                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? ' bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-black hover:shadow-xl transition duration-300'}`}
                            // onClick={onSubmit}
                        >
                            {isRegistering ? 'Signing Up...' : 'Create Account'}


                        </button>

                        </form>

                        <p className='flex items-center text-gray-500 text-sm'> 
                        <span className='flex-grow border-t border-gray-300'></span>
                        <span className='px-3'> Or Sign up with Google </span>
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

                        <div className='text-sm text-center'>
                            Already have an account? {'    '}
                            <Link to={'/sign-in'} className='text-center text-sm hover:underline font-bold'>Continue</Link>
                        </div>

                        <p className='text-sm max-w-xs mx-auto'>
                        By clicking create account, you agree to our <a href="" className='underline'>Terms of Service</a> and <a href="" className='underline'>Privacy Policy</a>
                </p>
                    
            </div>
        </main>
        </>
    )
}

export default Register