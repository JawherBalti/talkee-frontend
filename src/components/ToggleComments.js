import { useState } from 'react';
import Comments from './Comments';
import PostFooter from './PostFooter';
import CreateComment from './CreateComment';

function ToggleComments(props) {
  const [hideComment, setHideComment] = useState(true);

  const toggleComment = () => {
    setHideComment(!hideComment);
  };

  return (
    <div>
      <PostFooter
        post={props.post}
        user={props.user}
        toggleComment={toggleComment}
        showOrHide={hideComment ? 'Show ' : 'Hide '}
        handleLikesChange={props.handleLikesChange}
      />
      <CreateComment post={props.post} userId={props.userId} />
      {!hideComment ? <Comments post={props.post} /> : null}
    </div>
  );
}

export default ToggleComments;
