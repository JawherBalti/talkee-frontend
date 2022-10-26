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
    // dispatch(getFollowedPosts(user.userLogin.user.id));
    if (param.id) {
      dispatch(getUserPosts(param.id));
    }
    if (window.location.href.split('0/')[1] === 'explore') {
      dispatch(getAllPosts());
    }
  };
  return (
    <div className="post-footer">
      <div className="likes">
        {likes?.length &&
        likes
          .map((like) => like.UserId)
          .includes(props.user.userLogin.user.id) ? (
          <>
            <i
              onClick={() => react(props.post.id)}
              className="fas fa-heart fa-lg like-icon liked"
            ></i>
            {likes.length}
          </>
        ) : (
          <>
            <i
              onClick={() => react(props.post.id)}
              className="fas fa-heart fa-lg like-icon disliked"
            ></i>
            {likes.length}
          </>
        )}
      </div>
      <p className="show-comments" onClick={props.toggleComment}>
        {props.post.Comments.length > 0
          ? `${props.showOrHide}${props.post.Comments.length} Comment(s)`
          : 'Be the first to comment!'}
      </p>
    </div>
  );
}

export default PostFooter;
