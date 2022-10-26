import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../features/user/userSlice';
import {
  getAllPosts,
  getFollowedPosts,
  getUserPosts,
} from '../features/post/postSlice';
import LoadingSmall from './LoadingSmall';

function CreateComment(props) {
  const [comment, setComment] = useState('');

  const user = useSelector((state) => state.user);
  console.count('createComment');
  const dispatch = useDispatch();

  const addComment = (e, PostId) => {
    e.preventDefault();
    if (comment !== '') {
      const formData = { PostId, comment };
      dispatch(createComment(formData));
      if (window.location.href.split('3000')[1] === '/') {
        dispatch(getFollowedPosts(user.userLogin.user.id));
      }
      if (window.location.href.split('3000')[1] === '/explore') {
        dispatch(getAllPosts());
      }
      if (props.userId) {
        dispatch(getUserPosts(props.userId));
      }
    }
    setComment('');
  };

  return (
    <form
      className="add-comment"
      onSubmit={(e) => addComment(e, props.post.id)}
    >
      {user.commentLoading ? (
        <LoadingSmall loadingClass="comment-icon" width={20} height={20} />
      ) : (
        <i className="fas fa-comment fa-lg comment-icon"></i>
      )}
      <input
        className="comment-input"
        placeholder="Add a comment"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
      />
      <button className="comment-button" type="submit"></button>
    </form>
  );
}

export default CreateComment;
