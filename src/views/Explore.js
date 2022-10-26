import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreateComment from '../components/CreateComment';
import PostHeader from '../components/PostHeader';
import ToggleComments from '../components/ToggleComments';
import { getAllPosts } from '../features/post/postSlice';

const imageApi = 'http://localhost:3001/images/';

function Explore() {
  const post = useSelector((state) => state.post);
  const user = useSelector((state) => state.user);
  const comment = useSelector((state) => state.comment);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
    console.log(1);
  }, [dispatch, comment.commentDeleteLoading]);

  return (
    <div className="home">
      {/* {!user.postLoading ? ( */}
      <div className="post-container">
        {post.posts?.length ? (
          post.posts.map((p) => (
            <div className="post" key={p.id}>
              <PostHeader post={p} user={user} />
              <div className="post-content">
                <p>{p.content}</p>
                {p.attachmentUrl && (
                  <img src={imageApi + p.attachmentUrl} alt="post" />
                )}
              </div>
              <ToggleComments post={p} user={user} />
              <CreateComment post={p} />
            </div>
          ))
        ) : (
          <p>No posts !</p>
        )}
      </div>
      {/* // ) : (
  //   <LoadingSmall heigth={150} width={150} text="Creating post !" />
  // )} */}
    </div>
  );
}

export default Explore;
