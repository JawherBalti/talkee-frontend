import { Link } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../features/user/userSlice';
import LoadingSmall from '../components/LoadingSmall';
import LoadingLogo from '../components/LoadingLogo';

function Signup() {
  const firstName = useRef();
  const familyName = useRef();
  const email = useRef();
  const password = useRef();
  const password2 = useRef();
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState({
    firstName: false,
    familyName: false,
    email: false,
    password: false,
    password2: false
  });

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleFocus = (field) => {
    setIsFocused(prev => ({...prev, [field]: true}));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({...prev, [field]: false}));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (password.current.value === password2.current.value && password.current.value !== '') {
      dispatch(
        signup({
          firstName: firstName.current.value,
          familyName: familyName.current.value,
          email: email.current.value,
          password: password.current.value,
        })
      );
      setMessage(user.message);
    } else {
      setMessage('Passwords do not match!');
    }
  };

  return (
    <div className='login-container'>
      {/* <div className="login-branding">
        <Link to="/" className="logo-link">
          <div className="logo-login">
            <h1 className="logo-text">T</h1>
            <LoadingLogo width={50} height={30} className="logo-animation" />
            <h1 className="logo-text">lkee</h1>
          </div>
        </Link>
      </div> */}
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-title">
              <h2>Create your account</h2>
              <p>Join the Talkee community</p>
            </div>
            
            {message && (
              <div className="auth-message danger">{message}</div>
            )}
            {user && !user.loading && user.signupMessage ? (
              <div className="auth-message">{user.signupMessage}</div>
            ) : null}
            {user && !user.loading && user.error ? (
              <div className="auth-message danger">{user.error}</div>
            ) : null}
          </div>

          <form className="auth-form" onSubmit={submitHandler}>
            <div className={`form-group ${isFocused.firstName ? 'focused' : ''} ${firstName.current?.value ? 'has-value' : ''}`}>
              <label htmlFor="firstname">First name</label>
              <input
                id="firstname"
                type="text"
                onFocus={() => handleFocus('firstName')}
                onBlur={() => handleBlur('firstName')}
                ref={firstName}
              />
            </div>
            
            <div className={`form-group ${isFocused.familyName ? 'focused' : ''} ${familyName.current?.value ? 'has-value' : ''}`}>
              <label htmlFor="familyname">Family name</label>
              <input
                id="familyname"
                type="text"
                onFocus={() => handleFocus('familyName')}
                onBlur={() => handleBlur('familyName')}
                ref={familyName}
              />
            </div>
            
            <div className={`form-group ${isFocused.email ? 'focused' : ''} ${email.current?.value ? 'has-value' : ''}`}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                ref={email}
              />
            </div>
            
            <div className={`form-group ${isFocused.password ? 'focused' : ''} ${password.current?.value ? 'has-value' : ''}`}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                ref={password}
              />
            </div>
            
            <div className={`form-group ${isFocused.password2 ? 'focused' : ''} ${password2.current?.value ? 'has-value' : ''}`}>
              <label htmlFor="password2">Repeat password</label>
              <input
                id="password2"
                type="password"
                onFocus={() => handleFocus('password2')}
                onBlur={() => handleBlur('password2')}
                ref={password2}
              />
            </div>
            
            <button type="submit" className="auth-button secondary" disabled={user.loading}>
              {user.loading ? <LoadingSmall width={20} height={15} /> : 'Sign up'}
            </button>
            
            <div className="auth-footer">
              <span>Already have an account?</span>
              <Link to="/login" className="auth-link primary">Log in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;