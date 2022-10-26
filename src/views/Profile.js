import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import CreateComment from '../components/CreateComment';
import LoadingSmall from '../components/LoadingSmall';
import PostHeader from '../components/PostHeader';
import ToggleComments from '../components/ToggleComments';
import { getUserPosts } from '../features/post/postSlice';
import {
  followUser,
  getCurrentUser,
  getUser,
  unfollowUser,
} from '../features/user/userSlice';

const imageApi = 'http://localhost:3001/images/';
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

  const param = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser(param.id));
    dispatch(getUserPosts(param.id));
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
            src={imageApi + user.user.user.bannerUrl}
            alt="banner"
          />
          <div className="profile-header-info">
            <div className="profile-user-info">
              <img
                className="profile-header-avatar"
                src={imageApi + user.user.user.photoUrl}
                alt="avatar"
              />
              <div className="header-info">
                <h2 className="profile-header-name">
                  {user.user.user.firstName + ' ' + user.user.user.familyName}
                </h2>
                <span>{user.user.user.followers.length} Follower(s)</span>
              </div>
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
                    className="secondary"
                  >
                    Unfollow
                  </button>
                )}
              </>
            ) : null}
          </div>
        </div>
        <div className="profile-body">
          <div className="profile-info">
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
          <div className="user-posts">
            {/* {!post.userPostsLoading ? ( */}
            <>
              {post.userPosts.length ? (
                post.userPosts.map((p) => (
                  <div className="post" key={p.id}>
                    <PostHeader
                      post={p}
                      avatar={imageApi + user.user.user?.photoUrl}
                    />
                    <div className="post-content">
                      <p>{p.content}</p>
                      {p.attachmentUrl && (
                        <img src={imageApi + p.attachmentUrl} alt="post" />
                      )}
                    </div>
                    <ToggleComments post={p} user={user} />
                    <CreateComment post={p} userId={param.id} />
                  </div>
                ))
              ) : (
                <p>No posts ! </p>
              )}
            </>
            {/* // ) : (
               <LoadingSmall
                 loadingClass="loading-center"
                 heigth={150}
                 width={150}
                 text="Loading data.."
               />
             )} */}
          </div>
        </div>
      </div>
    )
  );
}

export default Profile;
