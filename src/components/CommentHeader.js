import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteComment } from '../features/comment/commentSlice';
import {
  getAllPosts,
  getFollowedPosts,
  getUserPosts,
} from '../features/post/postSlice';

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

  const showHideMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const commentDelete = (commentId) => {
    dispatch(deleteComment(commentId));
    // dispatch(getFollowedPosts(user.userLogin.user.id));
    if (param.id) {
      dispatch(getUserPosts(param.id));
    }
  };

  const goToProfile = (id) => {
    navigate('/profile/' + id);
  };

  return (
    <div className="comment-header">
      <div className="comment-info-details">
        {props.comment.User.photoUrl ? (
          <Link to={`/profile/${props.comment.User.id}`}>
            <img
              className="avatar"
              src={imageApi + props.comment.User.photoUrl}
              alt="user"
            />
          </Link>
        ) : null}
        <div className="comment-details">
          <h6
            onClick={() => goToProfile(props.comment.User.id)}
            className="user-info"
          >
            {props.comment.User.firstName.charAt(0).toUpperCase() +
              props.comment.User.firstName.slice(1) +
              ' ' +
              props.comment.User.familyName.charAt(0).toUpperCase() +
              props.comment.User.familyName.slice(1)}
          </h6>
          <p className="timestamp">
            {new Date(props.comment.createdAt).toLocaleDateString(
              'us-US',
              timestampOption
            )}
          </p>
        </div>
      </div>
      {user.userLogin.user.id === props.post.User.id ||
      user.currentUser.user?.role === true ||
      user.userLogin.user.id === props.comment.UserId ? (
        <div className="post-menu">
          <i
            onClick={showHideMenu}
            className="fas fa-ellipsis-h fa-lg post-burger"
          ></i>

          {toggleMenu ? (
            <ul className="menu">
              <li onClick={() => commentDelete(props.comment.id)}>Delete</li>
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default CommentHeader;
