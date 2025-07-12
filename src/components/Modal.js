import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getAllPosts,
  getFollowedPosts,
  getOnePost,
  getUserPosts,
  modifyPost,
} from '../features/post/postSlice';
import LoadingSmall from './LoadingSmall';

const imageApi = 'http://localhost:3001/images/';

function Modal(props) {
  const user = useSelector((state) => state.user);
  const post = useSelector((state) => state.post);

  const [postContent, setPostContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [preview, setPreview] = useState('');

  const dispatch = useDispatch();
  const param = useParams();

  useEffect(() => {
    dispatch(getOnePost(props.postId));
    if (param.id) dispatch(getUserPosts(param.id));
    else dispatch(getFollowedPosts(user.userLogin.user.id));

    setPostContent(post.post.content);
    setPreview(post.post.attachmentUrl);
    setAttachmentUrl(post.post.attachmentUrl);
  }, [
    dispatch,
    props.postId,
    post.post.attachmentUrl,
    post.post.content,
    param.id,
  ]);

  // const updatePost = () => {
  //   let formData = new FormData();
  //   formData.append('content', postContent);
  //   formData.append('image', attachmentUrl);

  //   let updateObj = {};

  //   if (attachmentUrl === null || typeof attachmentUrl === 'string') {
  //     updateObj = {
  //       postId: props.postId,
  //       formData: {
  //         content: postContent,
  //         attachmentUrl,
  //       },
  //     };
  //     setPostContent(updateObj.formData.content);
  //   } else {
  //     updateObj = {
  //       postId: props.postId,
  //       formData,
  //     };
  //   }

  //   if ((postContent !== '' && !attachmentUrl) || postContent !== '') {
  //     dispatch(modifyPost(updateObj));
  //     if (param.id) dispatch(getUserPosts(param.id));
  //     else dispatch(getFollowedPosts(user.userLogin.user.id));

  //     setPostContent('');
  //     setAttachmentUrl(null);
  //     props.closeModal();
  //   }
  //   if (param.id) dispatch(getUserPosts(param.id));
  //   else dispatch(getFollowedPosts(user.userLogin.user.id));
  // };

const updatePost = async () => {
  let imageUrl = attachmentUrl;
  
  if (attachmentUrl instanceof File) {
    try {
      const formData = new FormData();
      formData.append('file', attachmentUrl);
      formData.append('upload_preset', 'eiqxfhzq');
      
      const response = await fetch('https://api.cloudinary.com/v1_1/dv1lhvgjr/image/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      imageUrl = data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return;
    }
  }

  const updateObj = {
    postId: props.postId,
    formData: {
      content: postContent,
      attachmentUrl: imageUrl,
      oldAttachmentUrl: props.post?.attachmentUrl || null,
    },
  };

  if (postContent !== '' || imageUrl) {
    try {
      await dispatch(modifyPost(updateObj)).unwrap();
      props.closeModal();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }
};

  const selectedFile = (e) => {
    setAttachmentUrl(e.target.files[0]);
    setPreview((prev) => (prev = URL.createObjectURL(e.target.files[0])));
  };

  const removeFile = (e) => {
    setAttachmentUrl(null);
    setPreview('');
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h6>Update post !</h6>
        <div className="update-post">
          <input
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Update your post !"
            value={postContent}
          />
          <div className="add-post-btns">
            <input type="file" />
            <label className="file-upload secondary">
              <input
                type="file"
                onClick={(e) => {
                  e.target.value = null;
                }}
                onChange={selectedFile}
                accept="image/png, image/jpeg, image/bmp, image/gif"
              />
              Choose a file
            </label>
            <button className="secondary" onClick={removeFile}>
              Remove file
            </button>
          </div>
          <button onClick={updatePost} className="secondary">
            {user.postLoading ? (
              <LoadingSmall width={100} height={15} />
            ) : (
              'Update post'
            )}
          </button>
        </div>
        <button className="secondary" onClick={props.closeModal}>
          Close
        </button>
        {preview ? (
          <img
            className="preview"
            style={{ width: '10rem', height: '10rem' }}
            src={
              typeof attachmentUrl === 'object'
                ? preview
                : attachmentUrl
            }
            alt="attachment"
            // src={imageApi + preview}
          />
        ) : (
          'No image selected !'
        )}
      </div>
    </div>
  );
}

export default Modal;
