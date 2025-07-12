import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostHeader from '../components/PostHeader';
import ToggleComments from '../components/ToggleComments';
import { getAllPosts } from '../features/post/postSlice';
import { Link } from 'react-router-dom';

const imageApi = 'http://localhost:3001/images/';

function Explore() {
  const post = useSelector((state) => state.post);
  const user = useSelector((state) => state.user);
  const comment = useSelector((state) => state.comment);

  const dispatch = useDispatch();

  const loadMorePosts = () => {
    if (!post.postsHasMore || post.loading) return;
    
    const nextPage = post.postsCurrentPage + 1;
    dispatch(getAllPosts({ page: nextPage }));
  };

  useEffect(() => {
    // Reset to page 1 when component mounts or when comments change
    dispatch(getAllPosts({ page: 1 }));
  }, [dispatch, comment.commentDeleteLoading]);

  return (
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
      <div className='add-post'>
        <textarea disabled></textarea>
      </div>
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
            <p>No posts!</p>
          )}
        </div>
      {/* // ) : (
      //   <LoadingSmall heigth={150} width={150} text="Creating post !" />
      // )} */}
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

export default Explore;
