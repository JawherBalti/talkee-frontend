import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deletePost, getAllPosts } from '../features/post/postSlice';
import { getCurrentUser } from '../features/user/userSlice';
import Modal from './Modal';

const imageApi = 'http://localhost:3001/images/';
const timestampOption = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

function PostHeader(props) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.count('PostHeader');
    dispatch(getCurrentUser(user.userLogin.user.id));
  }, []);

  const showHideMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const postDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  const openModal = () => {
    setToggleModal(true);
    setToggleMenu(false);
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  const goToProfile = (id) => {
    navigate('/profile/' + id);
  };

  return (
    <div className="post-header">
      <div className="post-info-details">
        <Link to={`/profile/${props.post.User.id}`}>
          <img
            className="avatar"
            src={
              props.avatar ? props.avatar : imageApi + props.post.User.photoUrl
            }
            alt="user"
          />
        </Link>
        <div className="post-details">
          <h6
            className="user-info"
            onClick={() => goToProfile(props.post.User.id)}
          >
            {props.post.User.firstName.charAt(0).toUpperCase() +
              props.post.User.firstName.slice(1) +
              ' ' +
              props.post.User.familyName.charAt(0).toUpperCase() +
              props.post.User.familyName.slice(1)}
          </h6>
          <p className="timestamp">
            {new Date(props.post.createdAt).toLocaleDateString(
              'us-US',
              timestampOption
            )}
          </p>
        </div>
      </div>
      {user.userLogin.user.id === props.post.User.id ||
      user.currentUser.user?.role === true ? (
        <div className="post-menu">
          <i
            onClick={showHideMenu}
            className="fas fa-ellipsis-h fa-lg post-burger"
          ></i>

          {toggleMenu ? (
            <ul className="menu">
              {user.userLogin.user.id === props.post.User.id ? (
                <li onClick={openModal}>Modify</li>
              ) : null}
              <li onClick={() => postDelete(props.post.id)}>Delete</li>
            </ul>
          ) : null}
        </div>
      ) : null}
      {toggleModal ? (
        <Modal postId={props.post.id} closeModal={closeModal} />
      ) : null}
    </div>
  );
}

export default PostHeader;
