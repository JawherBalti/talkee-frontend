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
        <div className="user-avatar-container" onClick={() => goToProfile(props.post.User.id)}>
          <img
            className="user-avatar"
            src={props.avatar ? props.avatar : props.post.User.photoUrl}
            alt="user"
          />
        </div>
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
      {(user.userLogin.user.id === props.post.User.id ||
      user.currentUser.user?.role === true) && (
        <div className="post-menu">
          <button 
            className="menu-button"
            onClick={showHideMenu}
            aria-label="Post options"
          >
            <i className="fas fa-ellipsis-h"></i>
          </button>

          {toggleMenu && (
            <ul className="dropdown-menu">
              {user.userLogin.user.id === props.post.User.id && (
                <li className="dropdown-item" onClick={openModal}>
                  <i className="fas fa-edit"></i> Edit
                </li>
              )}
              <li className="dropdown-item" onClick={() => postDelete(props.post.id)}>
                <i className="fas fa-trash"></i> Delete
              </li>
            </ul>
          )}
        </div>
      )}
      {toggleModal && (
        <Modal post={props.post} postId={props.post.id} closeModal={closeModal} />
      )}
    </div>
  );
}

export default PostHeader;
