import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../features/user/userSlice';
//import { useNavigate } from 'react-router-dom';
import LoadingSmall from '../components/LoadingSmall';
import socketIOClient from 'socket.io-client';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:3001'
    : window.location.host;

function Login() {
  const email = useRef();
  const password = useRef();
  const socket = useRef();

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  //const navigate = useNavigate();
  useEffect(() => {
    socket?.current?.on('disconnect');
  }, [user, socket]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      login({
        email: email.current.value,
        password: password.current.value,
      })
    );
  };

  return (
    <div className="signup">
      <h5>Login</h5>
      {user && !user.loading && user.userLogin && user.userLogin.length ? (
        <p>{user.userLogin}</p>
      ) : null}
      {user && !user.loading && user.error ? <p>{user.error}</p> : null}

      <form className="form" onSubmit={submitHandler}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            placeholder="Enter your email"
            required
            ref={email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            ref={password}
          />
        </div>
        <div>
          <label />
          <button className="secondary" type="submit">
            {user.loading ? <LoadingSmall width={20} height={15} /> : 'Login'}
          </button>
        </div>
        <div>
          <label />
          <div>
            New to Talkee? <Link to="/signup">Create an account</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
