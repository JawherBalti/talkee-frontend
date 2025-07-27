import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getAllPosts,
  getFollowedPosts,
  getUserPosts,
  reactToPost,
} from '../features/post/postSlice';

function PostFooter(props) {
  const user = useSelector((state) => state.user);
  const [likes, setLikes] = useState([]);
  const dispatch = useDispatch();
  const param = useParams();

  useEffect(() => {
    console.count('PostFooter');
    setLikes(props.post.Likes);
  }, [props.post.Likes]);

  const react = (postId) => {
    dispatch(reactToPost(postId));
    if(!likes.map((like) => like.UserId).includes(props.user.userLogin.user.id)) {
      setLikes(prevLikes => [...prevLikes, {UserId:props.user.userLogin.user.id}])
    } else {
      const likeUserIdIndex = likes.map(like => like.UserId).indexOf(props.user.userLogin.user.id)
      const newLikes = [...likes];
      newLikes.splice(likeUserIdIndex,1)
      setLikes(newLikes)
    }
  };
  return (
    <div className="post-actions">
      <div className="action-buttons">
        <button 
          className={`like-button ${likes?.map(like => like.UserId).includes(props.user.userLogin.user.id) ? 'liked' : ''}`}
          onClick={() => react(props.post.id)}
          aria-label={likes?.map(like => like.UserId).includes(props.user.userLogin.user.id) ? 'Unlike' : 'Like'}
        >
          <i className="fas fa-heart"></i>
          {likes?.length > 0 && <span className="like-count">{likes.length}</span>}
        </button>
        
        <button 
          className="comment-button" 
          onClick={props.toggleComment}
          aria-label="Toggle comments"
        >
          <i className="fas fa-comment"></i>
        </button>
      </div>
      
      <div className="comment-toggle" onClick={props.toggleComment}>
        {props.post?.Comments?.length > 0 ? (
          <span className="comment-count">
            {props.showOrHide} {props.post.Comments.length} Comment{props.post.Comments.length !== 1 ? 's' : ''}
          </span>
        ) : (
          <span className="first-comment">Be the first to comment!</span>
        )}
      </div>
    </div>
  );
}

export default PostFooter;
