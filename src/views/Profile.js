import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import PostHeader from '../components/PostHeader';
import ToggleComments from '../components/ToggleComments';
import { getUserPosts } from '../features/post/postSlice';
import {
  followUser,
  getCurrentUser,
  getUser,
  unfollowUser,
} from '../features/user/userSlice';

const timestampOption = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

function Profile() {
  const user = useSelector((state) => state.user);
  const post = useSelector((state) => state.post);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const param = useParams();
  const dispatch = useDispatch();

  const loadMorePosts = () => {
    if (!post.userPostsHasMore || post.userPostsLoading) return;
    
    const nextPage = post.userPostsCurrentPage + 1;
    dispatch(getUserPosts({ 
      userId: param.id, 
      page: nextPage 
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Reset to page 1 when user changes
    dispatch(getUserPosts({ userId: param.id, page: 1 }));
    dispatch(getUser(param.id));
    dispatch(getCurrentUser(user.userLogin.user.id));
  }, [param.id, dispatch, user.followMessage, user.unfollowMessage]);

  const follow = (userId) => {
    dispatch(followUser(userId));
  };

  const unfollow = (userId) => {
    dispatch(unfollowUser(userId));
  };

  return (
    user.user.user && (
      <div className="user-profile">
        <div className="profile-header">
          <img
            className="banner"
            src={user.user.user.bannerUrl}
            alt="banner"
          />
          <div className="profile-header-info">
            <div className="profile-user-info">
              <img
                className="profile-header-avatar"
                src={user.user.user.photoUrl}
                alt="avatar"
              />
              <div className="header-info">
                <h2 className="profile-header-name">
                  {user.user.user.firstName + ' ' + user.user.user.familyName}
                </h2>
              </div>
                <span>{user.user.user.followersCount} Follower(s)</span>
                <span>{user.user.user.followingCount} Following</span>
            </div>
            {parseInt(param.id) !== user.userLogin.user.id ? (
              <>
                {!user.currentUser.user?.following.find(
                  (x) => parseInt(param.id) === x.id
                ) ? (
                  <button
                    onClick={() => follow(param.id)}
                    className="secondary"
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    onClick={() => unfollow(param.id)}
                    className="danger"
                  >
                    Unfollow
                  </button>
                )}
              </>
            ) : null}
          </div>
        </div>
        <div className="profile-body">
          {
          !isMobile && <div className="profile-info">
            <div className="more-info">
              <h6>Information</h6>
              <p>
                <span>Email: </span>
                {user.user.user.email}
              </p>
              <p>
                <span>Joined: </span>
                {new Date(user.user.user.createdAt)
                  .toLocaleDateString('us-US', timestampOption)
                  .substring(0, 12)}
              </p>
              <p>
                <span>Following: </span>
                {user.user.user.following.length} Person(s)
              </p>
            </div>
            <div className="bio">
              <h6>Biography</h6>
              <p>
                {parseInt(param.id) !== user.userLogin.user.id ? (
                  <span>
                    {!user.user.user.biography
                      ? 'No Biography!'
                      : user.user.user.biography}
                  </span>
                ) : (
                  <span>
                    {!user.user.user.biography ? (
                      <Link to="/settings">Add Biography</Link>
                    ) : (
                      user.user.user.biography
                    )}
                  </span>
                )}
              </p>
            </div>
            <div className="skills">
              <h6>Skills</h6>
              <p>
                {parseInt(param.id) !== user.userLogin.user.id ? (
                  <span>
                    {!user.user.user.skills
                      ? 'No Skills Added!'
                      : user.user.user.skills?.replace(/,/g, ' - ')}
                  </span>
                ) : (
                  <span>
                    {!user.user.user.skills ? (
                      <Link to="/settings">Add Skills</Link>
                    ) : (
                      user.user.user.skills
                    )}
                  </span>
                )}
              </p>
            </div>
          </div>
          }
          <div className={!isMobile ? "user-posts" : "user-posts-mobile"}>
            {/* {!post.userPostsLoading ? ( */}
            <div style={{width: '100%'}}>
              {post.userPosts.length ? (
                <>
                {post.userPosts.map((p) => (
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
                {post.userPostsHasMore && (
                  <button 
                    onClick={loadMorePosts}
                    className="load-more-btn"
                    disabled={post.userPostsLoading}
                  >
                    {post.userPostsLoading ? 'Loading...' : 'Show More'}
                  </button>
                )}
              </>
              ) : (
                <p>No posts ! </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Profile;
