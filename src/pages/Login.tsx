import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doCreateUserWithEmailAndPassword } from '../firebase/auth';
import { writeUserData } from '../firebase/firestore_write_new_user';
import { useAuth } from '../contexts/authContext';
// If you want toast notifications
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
    const [isActive, setIsActive] = useState(false);
    const { userLoggedIn } = useAuth() || { userLoggedIn: false };
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)

    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Registration form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Redirect if user is logged in
    useEffect(() => {
      if (userLoggedIn) {
        navigate("/");
      }
    }, [userLoggedIn, navigate]);

    // Your existing toggle functions
    const handleRegisterClick = () => {
      setIsActive(true);
    };

    const handleLoginClick = () => {
      setIsActive(false);
    };

    // Login with email/password
    const handleLogin = async (e: any) => {
      e.preventDefault();
      setIsLoggingIn(true);

      try {
        await doSignInWithEmailAndPassword(loginEmail, loginPassword);
        navigate("/");
        toast?.({
          title: 'Success!',
          description: 'Logged in successfully',
          variant: 'default',
        });
      } catch (error: any) {
        let errorMessage = "Error logging in with email and password";

        if (error.code === "auth/invalid-credential") {
          errorMessage = "Incorrect email or password. Please try again.";
        } else if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email format";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many failed login attempts. Try again later.";
        }

        console.error("Login error:", error);
        toast?.({
          title: 'There was a problem.',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoggingIn(false);
      }
    };

    // Login with Google
    const handleGoogleLogin = async () => {
      setIsLoading(true);

      try {
        await doSignInWithGoogle();
        navigate("/");
      } catch (error) {
        console.error("Google sign-in error:", error);
        toast?.({
          title: 'There was a problem.',
          description: 'There was an error logging in with Google',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Register new user
    const handleRegister = async (e: any) => {
      e.preventDefault();
      setIsRegistering(true);

      // Validate passwords match
      if (registerPassword !== confirmPassword) {
        toast?.({
          title: 'Password Error',
          description: 'Passwords do not match',
          variant: 'destructive',
        });
        setIsRegistering(false);
        return;
      }

      try {
        // Create user in Firebase Auth
        const userCredential = await doCreateUserWithEmailAndPassword(registerEmail, registerPassword);
        const user = userCredential.user;

        // Store user data in Firestore
        await writeUserData(
          user.uid,
          firstName,
          lastName,
          registerEmail,
          null, // phoneNumber
          null, // displayNameFromAuth
          false // isAdmin
        );

        navigate("/");
        toast?.({
          title: 'Account created!',
          description: 'Welcome to Ureno',
          variant: 'default',
        });
      } catch (error: any) {
        let errorMessage = "Error creating account";

        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email is already in use";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password is too weak";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email format";
        }

        console.error("Registration error:", error);
        toast?.({
          title: 'Registration Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsRegistering(false);
      }
    };

  return (
    <div className={styles.loginWrapper}>
      <div className={`${styles.container} ${isActive ? styles.active : ''}`}>
        <div className={`${styles.formBox} ${styles.login}`}>
        <form className={styles.form} onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className={styles.inputBox}>
            <input 
                type="email" 
                placeholder="Email" 
                required 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
            />
            <i className='bx bxs-user'></i>
            </div>
            <div className={styles.inputBox}>
            <input 
                type="password" 
                placeholder="Password" 
                required 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
            />
            <i className='bx bxs-lock-alt'></i>
            </div>
            <div className={styles.forgotLink}>
            <a href="#">Forgot Password?</a>
            </div>
            <button 
            type="submit" 
            className={styles.btn}
            disabled={isLoggingIn}
            >
            {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
            <p>or login with social platforms</p>
            <div className={styles.socialIcons}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleGoogleLogin(); }}>
                <i className='bx bxl-google'></i>
            </a>
            {/* other social icons */}
            </div>
        </form>
        </div>

        <div className={`${styles.formBox} ${styles.register}`}>
        <form className={styles.form} onSubmit={handleRegister}>
            <h1>Registration</h1>
            <div className={styles.inputBox}>
            <input 
                type="text" 
                placeholder="First Name" 
                required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <i className='bx bxs-user'></i>
            </div>
            <div className={styles.inputBox}>
            <input 
                type="text" 
                placeholder="Last Name" 
                required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <i className='bx bxs-user'></i>
            </div>
            <div className={styles.inputBox}>
            <input 
                type="email" 
                placeholder="Email" 
                required 
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <i className='bx bxs-envelope'></i>
            </div>
            <div className={styles.inputBox}>
            <input 
                type="password" 
                placeholder="Password" 
                required 
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <i className='bx bxs-lock-alt'></i>
            </div>
            <div className={styles.inputBox}>
            <input 
                type="password" 
                placeholder="Confirm Password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <i className='bx bxs-lock-alt'></i>
            </div>
            <button 
            type="submit" 
            className={styles.btn}
            disabled={isRegistering}
            >
            {isRegistering ? 'Creating Account...' : 'Register'}
            </button>
            <p>or register with social platforms</p>
            <div className={styles.socialIcons}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleGoogleLogin(); }}>
                <i className='bx bxl-google'></i>
            </a>
            {/* other social icons */}
            </div>
        </form>
        </div>

        <div className={styles.toggleBox}>
          <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className={styles.btn} onClick={handleRegisterClick}>Register</button>
          </div>

          <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className={styles.btn} onClick={handleLoginClick}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;