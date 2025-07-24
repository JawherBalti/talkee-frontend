import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PostHeader from '../components/PostHeader';
import ToggleComments from '../components/ToggleComments';
import { getAllPosts } from '../features/post/postSlice';
import ActiveFriends from '../components/ActiveFriends';
import ProfileCard from '../components/ProfileCard';
import Groups from '../components/Groups';
import QuickSettings from '../components/QuickSettings';

const imageApi = 'http://localhost:3001/images/';

function Explore() {
  const post = useSelector((state) => state.post);
  const user = useSelector((state) => state.user);
  const comment = useSelector((state) => state.comment);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dispatch = useDispatch();

  const loadMorePosts = () => {
    if (!post.postsHasMore || post.loading) return;
    
    const nextPage = post.postsCurrentPage + 1;
    dispatch(getAllPosts({ page: nextPage }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(getAllPosts({ page: 1 }));
  }, [dispatch, comment.commentDeleteLoading]);

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
        {/* Show Active Friends above content on mobile */}
        {isMobile && (
          <div className="">
            <ActiveFriends user={user} />
          </div>
        )}
        
        <div className="post-container">
          {post.posts?.length ? (
            <>
              {post.posts.map((p) => (
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
              
              {post.postsHasMore && (
                <button 
                  onClick={loadMorePosts}
                  className="load-more-btn"
                  disabled={post.loading}
                >
                  {post.loading ? 'Loading...' : 'Show More'}
                </button>
              )}
            </>
          ) : (
            <p className="no-posts">No posts found</p>
          )}
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile */}
      {!isMobile && (
        <div className="right-sidebar">
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
          </div>

          <div className="follow-suggestions">
            <h3>Who to follow</h3>
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
          </div>

          <div className="sidebar-footer">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
            <span>© 2023 Talkee</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;