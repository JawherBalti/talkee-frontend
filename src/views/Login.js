import  { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../features/user/userSlice';
import LoadingSmall from '../components/LoadingSmall';
import LoadingLogo from '../components/LoadingLogo';

function Login() {
  const email = useRef();
  const password = useRef();
  const socket = useRef();
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket?.current?.on('disconnect');
  }, [user, socket]);

  useEffect(() => {
    // Check if already logged in
    if (user.isLoggedIn) {
      navigate('/');
    }
  }, [user.isLoggedIn, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      login({
        email: email.current.value,
        password: password.current.value,
      })
    );
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({...prev, [field]: true}));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({...prev, [field]: false}));
  };

  return (
    <div className='login-container'>
      <div>
        <Link to="/">
          <div className="logo-login">
            <h1>T</h1>
            <LoadingLogo width={50} height={30} />
            <h1>lkee</h1>
          </div>
        </Link>
      </div>
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div>
            <h2>Welcome back</h2>
            <p>Log in to continue to Talkee</p>
          </div>
          {user && !user.loading && user.userLogin && user.userLogin.length ? (
            <div className="auth-message danger">{user.userLogin}</div>
          ) : null}
          {user && !user.loading && user.error ? (
            <div className="auth-message danger">{user.error}</div>
          ) : null}
        </div>



        <form className="auth-form" onSubmit={submitHandler}>
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
          
          <button type="submit" className="auth-button secondary" disabled={user.loading}>
            {user.loading ? <LoadingSmall width={20} height={15} /> : 'Log in'}
          </button>
          
          <div className="auth-footer">
            <span>Don't have an account?</span>
            <Link to="/signup" className="auth-link primary">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;