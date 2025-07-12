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
import Login from './Login';

let firstRender = true;
const imageApi = 'http://localhost:3001/images/';

function Home() {

  const user = useSelector((state) => state.user);
  const post = useSelector((state) => state.post);
  const comment = useSelector((state) => state.comment);

  const [currentPage, setCurrentPage] = useState(1);

  const loadMorePosts = () => {
    if (!post.hasMore || post.followedPostsLoading) return;
    
    const nextPage = post.currentPage + 1;
    dispatch(getFollowedPosts({ 
      userId: user.userLogin.user.id, 
      page: nextPage 
    }));
  };

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
        setCurrentPage(1);
        dispatch(getFollowedPosts({ userId: user.userLogin.user.id, page: 1 }));      if (firstRender) {
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
    user.postMessage
    ]);


  return !user.isLoggedIn ? <Login/> : (
    <div className="home-container">
      {/* Left Sidebar */}
      <div className="left-sidebar">
        {/* User Profile Card */}
        <div className="profile-card">
          <Link to={`/profile/${user.userLogin.user?.id}`}>
            <img 
              src={user.currentUser.user?.photoUrl} 
              alt="Profile" 
              className="profile-avatar"
            />
          </Link>
          <div className="profile-info">
            <h4>{user.userLogin.user?.firstName} {user.userLogin.user?.familyName}</h4>
            <p>@{user.userLogin.user?.firstName.toLowerCase()}_{user.userLogin.user?.familyName.toLowerCase()}</p>
          </div>
        </div>

          {/* Friends List */}
          <div className="friends-section">
            <div className="section-header">
              <h3>Active Friends</h3>
              <Link to="/friends">See All</Link>
            </div>
            <div className="friends-list">
              {user.friends?.slice(0, 5).map(friend => (
                <Link to={`/profile/${friend.id}`} key={friend.id} className="friend-item">
                  <div className="friend-avatar-container">
                    <img 
                      src={imageApi + friend.photoUrl} 
                      alt={friend.firstName} 
                      className="friend-avatar"
                    />
                    <span className={`status-dot ${friend.isOnline ? 'online' : ''}`}></span>
                  </div>
                  <span className="friend-name">{friend.firstName}</span>
                </Link>
              ))}
            </div>
          </div>

        {/* Groups/Communities */}
        <div className="groups-section">
          <div className="section-header">
            <h3>Your Groups</h3>
            <Link to="/groups">See All</Link>
          </div>
          <div className="groups-list">
            {user.groups?.slice(0, 3).map(group => (
              <Link to={`/group/${group.id}`} key={group.id} className="group-item">
                <img 
                  src={imageApi + group.coverImage} 
                  alt={group.name} 
                  className="group-avatar"
                />
                <div className="group-info">
                  <h4>{group.name}</h4>
                  <p>{group.memberCount} members</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h3>Quick Settings</h3>
          </div>
          <div className="settings-options">
            <button className="settings-option">
              <i className="fas fa-bell"></i> Notifications
            </button>
            <button className="settings-option">
              <i className="fas fa-moon"></i> Dark Mode
            </button>
            <button className="settings-option">
              <i className="fas fa-lock"></i> Privacy
            </button>
            <Link to="/settings" className="settings-option">
              <i className="fas fa-cog"></i> All Settings
            </Link>
          </div>
        </div>
      </div>


    <div className="home">
      <CreatePost />
      <div className="post-container">
        {post.followedPosts?.length ? (
          <>
            { post.followedPosts.map((p) => (
              <div className="post-card" key={p.id}>
                <PostHeader post={p} user={user} />
                <div className="post-content">
                  <p className="post-text">{p.content}</p>
                  {p.attachmentUrl && (
                    <div className="post-image-container">
                      <img 
                        width={500}
                        src={p.attachmentUrl} 
                        alt="post" 
                        className="post-image"
                        onClick={() => window.open(p.attachmentUrl, '_blank')}
                      />
                    </div>
                  )}
                </div>
                <ToggleComments post={p} user={user} />
              </div>
            ))}
            {post.hasMore && (
              <button 
                onClick={loadMorePosts}
                className="load-more-btn"
                disabled={post.followedPostsLoading}
              >
                {post.followedPostsLoading ? 'Loading...' : 'Show More'}
              </button>
            )}
          </>
        ) : (
          <p>No posts !</p>
        )}
      </div>
    </div>

    {/* Right Sidebar */}
  <div className="right-sidebar">

    {/* Trending Topics */}
    <div className="trending-card">
      <h3>Trends for you</h3>
      <div className="trend-item">
        <span className="trend-category">Technology · Trending</span>
        <h4>#WebDevelopment</h4>
        <span className="trend-count">5,245 posts</span>
      </div>
      <div className="trend-item">
        <span className="trend-category">Sports · Trending</span>
        <h4>FIFA World Cup 2022</h4>
        <span className="trend-count">2,252 posts</span>
      </div>
      {/* Add more trend items */}
    </div>

    {/* Who to follow */}
    <div className="follow-suggestions">
      <h3>Who to follow</h3>
      {/* Sample suggestion */}
      <div className="suggestion-item">
        <img src="https://res.cloudinary.com/dv1lhvgjr/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733130700/rc4ehgdckeancgybr4dd.jpg" alt="Suggested user" />
        <div className="suggestion-info">
          <h4>Jane Doe</h4>
          <p>@janedoe</p>
        </div>
        <button className="follow-btn">Follow</button>
      </div>
      <div className="suggestion-item">
        <img src="https://res.cloudinary.com/dv1lhvgjr/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733000771/1728213571268_lrmzme.jpg" alt="Suggested user" />
        <div className="suggestion-info">
          <h4>John Doe</h4>
          <p>@johndoe</p>
        </div>
        <button className="follow-btn">Follow</button>
      </div>
      {/* Add more suggestions */}
    </div>

    {/* Footer Links */}
    <div className="sidebar-footer">
      <a href="#">Terms</a>
      <a href="#">Privacy</a>
      <a href="#">Cookies</a>
      <span>© 2023 Talkee</span>
    </div>
  </div>
</div>
  );
}
export default Home;
