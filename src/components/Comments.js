import CommentHeader from './CommentHeader';

function Comments(props) {
  return (
    <div className="comments-container">
      {props.post.Comments.map((c) => (
        <div className="comment-card" key={c.id}>
          <CommentHeader comment={c} post={props.post} />
          <div className="comment-body">
            <p className="comment-text">{c.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Comments;