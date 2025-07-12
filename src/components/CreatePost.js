import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../features/user/userSlice';
import LoadingSmall from './LoadingSmall';

function CreatePost() {
  const [postContent, setPostContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const uploadImageToCloudinary = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'eiqxfhzq'); // Replace with your upload preset
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dv1lhvgjr/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const addPost = async () => {
    if ((postContent !== '' && attachmentUrl !== '') || postContent !== '') {
      let imageUrl = '';
      
      if (attachmentUrl) {
        imageUrl = await uploadImageToCloudinary(attachmentUrl);
        if (!imageUrl) {
          // Handle upload error
          return;
        }
      }
      
      const postData = {
        content: postContent,
        attachmentUrl: imageUrl,
      };
      
      dispatch(createPost(postData));
    }
    setPostContent('');
    setAttachmentUrl('');
  };

  const selectedFile = (e) => {
    if (e.target.files[0]) {
      setAttachmentUrl(e.target.files[0]);
    }
  };

  return (
    <div className="add-post">
      <textarea
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Speak your mind!"
        value={postContent}
      ></textarea>
      <div className="add-post-btns">
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

        <button 
          onClick={addPost} 
          className="secondary"
          disabled={isUploading || user.postLoading}
        >
          {isUploading || user.postLoading ? (
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