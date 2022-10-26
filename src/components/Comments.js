import React from 'react';
import CommentHeader from './CommentHeader';

function Comments(props) {
  return (
    <div className="post-comments">
      {props.post.Comments.map((c) => (
        <div className="comment" key={c.id}>
          <CommentHeader comment={c} post={props.post} />
          <div className="comment-content">
            <p>{c.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Comments;
