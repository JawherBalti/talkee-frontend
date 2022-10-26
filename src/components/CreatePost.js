import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../features/user/userSlice';
import { getFollowedPosts } from '../features/post/postSlice';
import LoadingSmall from './LoadingSmall';

function CreatePost() {
  const [postContent, setPostContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const addPost = () => {
    const formData = new FormData();
    formData.append('content', postContent);
    formData.append('image', attachmentUrl);
    if ((postContent !== '' && attachmentUrl !== '') || postContent !== '') {
      dispatch(createPost(formData));
      // dispatch(getFollowedPosts(user.userLogin.user.id));
    }
    setPostContent('');
    setAttachmentUrl('');
  };

  const selectedFile = (e) => {
    setAttachmentUrl(e.target.files[0]);
  };
  return (
    <div className="add-post">
      <textarea
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Speak your mind!"
        value={postContent}
      ></textarea>
      <div className="add-post-btns">
        <input type="file" />
        <label className="file-upload primary">
          <input
            type="file"
            onClick={(e) => {
              e.target.value = null;
            }}
            onChange={selectedFile}
            accept="image/png, image/jpeg, image/bmp, image/gif"
          />
          Choose a file
          {attachmentUrl && <span> {attachmentUrl.name}</span>}
        </label>

        <button onClick={addPost} className="primary">
          {user.postLoading ? (
            <LoadingSmall width={100} height={15} />
          ) : (
            'Create a post'
          )}
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
