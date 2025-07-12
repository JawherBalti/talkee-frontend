import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../features/user/userSlice';
import LoadingSmall from './LoadingSmall';

function CreateComment(props) {
  const imageApi = 'http://localhost:3001/images/';

  const [comment, setComment] = useState('');

  const user = useSelector((state) => state.user);
  const currentUser = useSelector((state) => state.user.userLogin.user);

  const dispatch = useDispatch();

  const addComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(
        createComment({
          PostId: props.post.id,
          comment,
          // Include current user data for optimistic update
          UserId: currentUser.id,
          firstName: currentUser.firstName,
          photoUrl: currentUser.photoUrl,
        })
      );
      setComment('');
    }
  };

  return (
    <form className="comment-form" onSubmit={addComment}>
      <div className="comment-input-container">
        <div className="user-avatar-container">
          <img 
            src={currentUser.photoUrl} 
            alt="user" 
            className="user-avatar"
          />
        </div>
        <input
          className="comment-input"
          placeholder="Write a comment..."
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <button 
          className="submit-comment" 
          type="submit"
          disabled={!comment.trim() || user.commentLoading}
        >
          {user.commentLoading ? (
            <LoadingSmall width={20} height={20} />
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
        </button>
      </div>
    </form>
  );
}

export default CreateComment;
