import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getUser } from '../features/user/userSlice';
import { getFollowedPosts } from '../features/post/postSlice';
import PostHeader from '../components/PostHeader';
import CreatePost from '../components/CreatePost';
import ToggleComments from '../components/ToggleComments';
import axios from 'axios';
import Login from './Login';
import QuickSettings from '../components/QuickSettings';
import Groups from '../components/Groups';
import ActiveFriends from '../components/ActiveFriends';
import ProfileCard from '../components/ProfileCard';
import Trending from '../components/Trending';
import FollowSuggestions from '../components/FollowSuggestions';
import Links from '../components/Links';

let firstRender = true;
const imageApi = 'http://localhost:3001/images/';

function Home() {
  const user = useSelector((state) => state.user);
  const post = useSelector((state) => state.post);
  const comment = useSelector((state) => state.comment);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    try {
      const res = await axios.get('http://localhost:3001/api/post/refresh', { 
        withCredentials: true 
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user.userLogin.user) {
      dispatch(getUser(user.userLogin.user.id));
      dispatch(getCurrentUser(user.userLogin.user.id));
    }
  }, [dispatch, user.userLogin.user]);

  useEffect(() => {
    if (user.userLogin.user) {
      setCurrentPage(1);
      dispatch(getFollowedPosts({ userId: user.userLogin.user.id, page: 1 }));
      
      if (firstRender) {
        firstRender = false;
      }
      
      const interval = setInterval(() => {
        refreshToken().then(() =>
          dispatch(getFollowedPosts(user.userLogin.user.id))
        );
      }, 1000 * 60 * 59 * 24);

      return () => clearInterval(interval);
    }
  }, [navigate, dispatch, user.userLogin.user, post.likeMessage]);

  if (!user.isLoggedIn) return <Login />;

  return (
    <div className="home-container">
      {/* Left Sidebar - Hidden on mobile */}
      {!isMobile && (
        <div className="left-sidebar">
          <ProfileCard user={user} />
          <ActiveFriends user={user} />
          <Groups user={user} />
          <QuickSettings />
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Show ActiveFriends above content on mobile */}
        {isMobile && (
          <div className="">
            <ActiveFriends user={user} />
          </div>
        )}
        <br></br>
        <br></br>
        <CreatePost />

        <div className="post-container">
          {post.followedPosts?.length ? (
            <>
              {post.followedPosts.map((p) => (
                <div className="post-card" key={p.id}>
                  <PostHeader post={p} user={user} />
                  <div className="post-content">
                    <p className="post-text">{p.content}</p>
                    {p.attachmentUrl && (
                      <div className="post-image-container">
                        <img 
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
            <p className="no-posts">No posts to show</p>
          )}
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile */}
      {!isMobile && (
        <div className="right-sidebar">
          <Trending />
          <FollowSuggestions />
          <Links />
        </div>
      )}
    </div>
  );
}

export default Home;