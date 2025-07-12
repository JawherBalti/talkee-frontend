import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteComment } from '../features/comment/commentSlice';
import { getAllPosts, getFollowedPosts, getUserPosts } from '../features/post/postSlice';

const imageApi = 'http://localhost:3001/images/';
const timestampOption = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

function CommentHeader(props) {
  const user = useSelector((state) => state.user);
  const [toggleMenu, setToggleMenu] = useState(false);
  const param = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showHideMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const commentDelete = (commentId) => {
    dispatch(deleteComment(commentId));
    if (param.id) {
      dispatch(getUserPosts(param.id));
    }
  };

  const goToProfile = (id) => {
    navigate('/profile/' + id);
  };

  const commentUser = props.comment?.User || user.currentUser.user;

  return (
    <div className="comment-header">
      <div className="comment-user">
        <div 
          className="user-avatar-container"
          onClick={() => goToProfile(commentUser.id)}
        >
          <img
            className="user-avatar"
            src={commentUser.photoUrl}
            alt="user"
          />
        </div>
        
        <div className="user-details">
          <h6 
            className="username"
            onClick={() => goToProfile(commentUser.id)}
          >
            {`${commentUser.firstName.charAt(0).toUpperCase()}${commentUser.firstName.slice(1)} ${commentUser.familyName.charAt(0).toUpperCase()}${commentUser.familyName.slice(1)}`}
          </h6>
          <p className="comment-time">
            {new Date(props.comment.createdAt).toLocaleDateString('us-US', timestampOption)}
          </p>
        </div>
      </div>

      {(user.userLogin.user.id === props.post.User.id ||
        user.currentUser.user?.role === true ||
        user.userLogin.user.id === props.comment.UserId) && (
        <div className="comment-actions">
          <button 
            className="menu-button"
            onClick={showHideMenu}
            aria-label="Comment options"
          >
          </button>

          {toggleMenu && (
            <div className="dropdown-menu">
              <button 
                className="dropdown-item danger"
                onClick={() => commentDelete(props.comment.id)}
              >
                Delete Comment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentHeader;