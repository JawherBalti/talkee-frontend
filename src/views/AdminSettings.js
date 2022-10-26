import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, updateUserRole } from '../features/user/userSlice';
import { useNavigate, useParams } from 'react-router-dom';

const imageApi = 'http://localhost:3001/images/';

function AdminSettings() {
  const user = useSelector((state) => state.user.user.user);

  const [firstName, setFirstName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState();
  const [photoUrl, setPhotoUrl] = useState('');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [previewBannerUrl, setPreviewBannerUrl] = useState('');
  const [role, setRole] = useState();
  const [newRole, setNewRole] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    dispatch(getUser(param.id));
    setFirstName(user?.firstName);
    setFamilyName(user?.familyName);
    setBio(user.biography);
    setSkills(user.skills);
    setPreviewPhotoUrl(user.photoUrl);
    setPreviewBannerUrl(user.bannerUrl);
    setPhotoUrl(user.photoUrl);
    setBannerUrl(user.bannerUrl);
    setRole(user.role);
  }, [
    dispatch,
    user.firstName,
    user.photoUrl,
    user.familyName,
    user.biography,
    user.skills,
    user.previewBannerUrl,
    user.previewPhotoUrl,
    user.bannerUrl,
    user.role,
    param.id,
  ]); //infinite loop because of currentUser

  const submitRoleHandler = (e) => {
    e.preventDefault();
    if (newRole !== undefined) {
      const updateObj = {
        userId: param.id,
        formData: {
          newRole,
        },
      };
      dispatch(updateUserRole(updateObj));
      navigate('/admin');
    } else console.log('select a role !');
  };

  return (
    <div className="settings">
      <div className="profile-settings">
        <h5>Profile Information:</h5>
        <div className="username-settings">
          <form className="form">
            <h6>User Name:</h6>
            <div>
              <label>First Name: {firstName}</label>
              <label>Family Name: {familyName}</label>
            </div>
          </form>
        </div>

        <div>
          <h6>Profile Images</h6>
          <div className="profile-image-settings">
            <div className="form">
              <div className="avatar-form">
                <label>Avatar</label>
                <img
                  className="update-avatar"
                  style={{ width: '10rem', height: '10rem' }}
                  src={
                    typeof photoUrl === 'object'
                      ? previewPhotoUrl
                      : imageApi + photoUrl
                  }
                  alt="attachment"
                />
              </div>
            </div>
            <div className="form">
              <div className="banner-form">
                <label>Banner</label>
                <img
                  className="update-banner"
                  style={{ width: '10rem', height: '10rem' }}
                  src={
                    typeof bannerUrl === 'object'
                      ? previewBannerUrl
                      : imageApi + bannerUrl
                  }
                  alt="attachment"
                  // src={imageApi + preview}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form">
          <h6>Other Information</h6>
          <div>
            <label>Skills: {skills}</label>
          </div>
        </div>
        <div className="form">
          <div>
            <label>Biography: {bio}</label>
          </div>
        </div>
        <form className="form" onSubmit={submitRoleHandler}>
          <div>
            <label className="role">
              Role:
              {user.role === true ? (
                <select onChange={(e) => setNewRole(e.target.value)}>
                  <option value="1">Change Role</option>
                  <option value="0">User</option>
                </select>
              ) : (
                <select onChange={(e) => setNewRole(e.target.value)}>
                  <option value="0">Change Role</option>
                  <option value="1">Admin</option>
                </select>
              )}
              <button className="secondary" type="submit">
                Change Role
              </button>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminSettings;
