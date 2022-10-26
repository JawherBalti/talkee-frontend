import { Link } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../features/user/userSlice';
import LoadingSmall from '../components/LoadingSmall';

function Signup() {
  const firstName = useRef();
  const familyName = useRef();
  const email = useRef();
  const password = useRef();
  const password2 = useRef();
  const [message, setMessage] = useState('');

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      password.current.value === password2.current.value &&
      password.current.value !== ''
    ) {
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
      alert('Passwords do not match!');
    }
  };

  return (
    <div className="signup">
      <h5>Signup</h5>
      {user && !user.loading ? <p>{user?.signupMessage}</p> : null}
      {user && !user.loading && user.error ? <p>{user.error}</p> : null}
      <form className="form" onSubmit={submitHandler}>
        <div>
          <label htmlFor="email">First name</label>
          <input
            id="firstname"
            type="text"
            placeholder="Enter your first name"
            required
            ref={firstName}
          />
        </div>
        <div>
          <label htmlFor="email">Family name</label>
          <input
            id="family name"
            type="text"
            placeholder="Enter your family name"
            required
            ref={familyName}
          />
        </div>
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
          <label htmlFor="password">Repeat password</label>
          <input
            id="password2"
            type="password"
            placeholder="Repeat your password"
            required
            ref={password2}
          />
        </div>
        <div>
          <button className="secondary" type="submit">
            {user && user.loading ? (
              <LoadingSmall width={20} height={15} />
            ) : (
              'Signup'
            )}
          </button>
        </div>
        <div>
          <div>
            Do you have an account? <Link to="/login">Login now</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
