import React, { useState } from 'react';
// import { Box } from 'boxicons';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={`${styles.container} ${isActive ? styles.active : ''}`}>
        <div className={`${styles.formBox} ${styles.login}`}>
          <form className={styles.form} action="#">
            <h1>Login</h1>
            <div className={styles.inputBox}>
              <input type="text" placeholder="Email" required />
              <i className='bx bxs-user'></i>
            </div>
            <div className={styles.inputBox}>
              <input type="password" placeholder="Password" required />
              <i className='bx bxs-lock-alt'></i>
            </div>
            <div className={styles.forgotLink}>
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className={styles.btn}>Login</button>
            <p>or login with social platforms</p>
            <div className={styles.socialIcons}>
              <a href="#"><i className='bx bxl-google'></i></a>
              <a href="#"><i className='bx bxl-facebook'></i></a>
              <a href="#"><i className='bx bxl-github'></i></a>
              <a href="#"><i className='bx bxl-linkedin'></i></a>
            </div>
          </form>
        </div>

        <div className={`${styles.formBox} ${styles.register}`}>
          <form className={styles.form} action="#">
            <h1>Registration</h1>
            <div className={styles.inputBox}>
              <input type="text" placeholder="First Name" required />
              <i className='bx bxs-user'></i>
            </div>
            <div className={styles.inputBox}>
              <input type="text" placeholder="Last Name" required />
              <i className='bx bxs-user'></i>
            </div>
            <div className={styles.inputBox}>
              <input type="email" placeholder="Email" required />
              <i className='bx bxs-envelope'></i>
            </div>
            <div className={styles.inputBox}>
              <input type="password" placeholder="Password" required />
              <i className='bx bxs-lock-alt'></i>
            </div>
            <div className={styles.inputBox}>
              <input type="password" placeholder="Confirm Password" required />
              <i className='bx bxs-lock-alt'></i>
            </div>
            <button type="submit" className={styles.btn}>Register</button>
            <p>or register with social platforms</p>
            <div className={styles.socialIcons}>
              <a href="#"><i className='bx bxl-google'></i></a>
              <a href="#"><i className='bx bxl-facebook'></i></a>
              <a href="#"><i className='bx bxl-github'></i></a>
              <a href="#"><i className='bx bxl-linkedin'></i></a>
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