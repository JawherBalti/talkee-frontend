import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, getUser, login } from '../features/user/userSlice';
import { getFollowedPosts } from '../features/post/postSlice';
import CreateComment from '../components/CreateComment';
import PostHeader from '../components/PostHeader';
import CreatePost from '../components/CreatePost';
import ToggleComments from '../components/ToggleComments';
import axios from 'axios';

let firstRender = true;
const imageApi = 'http://localhost:3001/images/';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = useSelector((state) => state.user);
  const post = useSelector((state) => state.post);
  const comment = useSelector((state) => state.comment);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const refreshToken = async () => {
    const res = await axios
      .get('http://localhost:3001/api/post/refresh', { withCredentials: true })
      .catch((err) => console.log(err));
    const data = res.data;
    return data;
  };

  // useEffect(() => {
  //   socket.current = io('ws://localhost:3001');
  // }, []);

  useEffect(() => {
    if (user.userLogin.user) {
      dispatch(getUser(user.userLogin.user.id));
      dispatch(getCurrentUser(user.userLogin.user.id));
    }
  }, [dispatch, user.userLogin.user]);

  useEffect(() => {
    if (user.userLogin.user) {
      dispatch(getFollowedPosts(user.userLogin.user.id));
      if (firstRender) {
        firstRender = false;
      }
      let interval = setInterval(() => {
        refreshToken().then(() =>
          dispatch(getFollowedPosts(user.userLogin.user.id))
        );
      }, 1000 * 60 * 59 * 24);

      //setInteval working after 24hours - 1minute
      return () => clearInterval(interval);
    }
  }, [
    navigate,
    dispatch,
    user.userLogin.user,
    post.likeMessage,
    comment.commentDeleteMessage,
    // post.followedPostsMessage,
    user.postMessage,
    user.commentCreatedMessage,
  ]);

  // useEffect(() => {
  //   if (user.userLogin.user) {
  //     socket?.current.emit('addUser', user.userLogin.user.id);
  //   } else {
  //     socket?.current.on('disconnect');
  //   }
  // }, [socket, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      login({
        email,
        password,
      })
    );
  };

  return !user.isLoggedIn ? (
    <div className="home">
      <h5>Talkee</h5>
      <h6>The space where your freedom of expression is guaranteed</h6>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label />
          <button className="secondary" type="submit">
            Login
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
  ) : (
    <div className="home">
      <CreatePost />
      {/* {!user.postLoading ? ( */}
      <div className="post-container">
        {post.followedPosts?.length ? (
          post.followedPosts.map((p) => (
            <div className="post" key={p.id}>
              <PostHeader post={p} user={user} />
              <div className="post-content">
                <p>{p.content}</p>
                {p.attachmentUrl && (
                  <img src={imageApi + p.attachmentUrl} alt="post" />
                )}
              </div>
              <ToggleComments post={p} user={user} />
              <CreateComment post={p} />
            </div>
          ))
        ) : (
          <p>No posts !</p>
        )}
      </div>
      {/* // ) : (
      //   <LoadingSmall heigth={150} width={150} text="Creating post !" />
      // )} */}
    </div>
  );
}
export default Home;
