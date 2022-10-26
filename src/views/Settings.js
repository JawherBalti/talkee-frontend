import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUser,
  updateUser,
  updateAvatar,
  updateBanner,
  updateUserInfo,
  getCurrentUser,
} from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const imageApi = 'http://localhost:3001/images/';

function Settings() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [confirtmDeletePassword, setConfirmDeletePassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);

  const currentUserId = useSelector((state) => state.user.userLogin.user.id);
  const currentUser = useSelector((state) => state.user.currentUser.user);

  const [photoUrl, setPhotoUrl] = useState('');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [previewBannerUrl, setPreviewBannerUrl] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCurrentUser(currentUserId));
    setFirstName(currentUser?.firstName);
    setFamilyName(currentUser?.familyName);
    setBio(currentUser.biography);
    if (currentUser.skills) setSkills(currentUser.skills.split(','));
    setPreviewPhotoUrl(currentUser.photoUrl);
    setPreviewBannerUrl(currentUser.bannerUrl);
    setPhotoUrl(currentUser.photoUrl);
    setBannerUrl(currentUser.bannerUrl);
  }, [
    dispatch,
    currentUser.photoUrl,
    currentUser.firstName,
    currentUser.familyName,
    currentUser.biography,
    currentUser.skills,
    currentUser.previewBannerUrl,
    currentUser.previewPhotoUrl,
    currentUser.bannerUrl,
    currentUserId,
  ]); //infinite loop because of currentUser

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    const value = e.target.value;
    if (!value.trim()) return;
    setSkills([...skills, value]);
    e.target.value = '';
    console.log(skills.toString());
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((skill, i) => i !== index));
  };

  const submitChangeUserNameHandler = (e) => {
    e.preventDefault();
    if (firstName !== '' && familyName !== '') {
      const updateObj = {
        userId: currentUser.id,
        formData: {
          firstName,
          familyName,
        },
      };
      dispatch(updateUser(updateObj));
      navigate('/profile/' + currentUser.id);
    } else console.log('pwd not matching');
  };

  const submitDeleteHandler = () => {};

  const submitChangePasswordHandler = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const updateObj = {
        userId: currentUser.id,
        formData: password,
      };
      dispatch(updateUser(updateObj));
    } else console.log('pwd not matching');
  };

  const submitProfileInfoHandler = (e) => {
    e.preventDefault();
    if (bio !== '' || skills !== '') {
      const updateObj = {
        userId: currentUser.id,
        formData: {
          bio,
          skills: skills.toString(),
        },
      };
      dispatch(updateUserInfo(updateObj));
      navigate('/profile/' + currentUser.id);
    } else console.log('pwd not matching');
  };

  const submitChangeAvatarHandler = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('image', photoUrl);

    if (photoUrl) {
      const updateObj = {
        userId: currentUser.id,
        formData,
      };
      dispatch(updateAvatar(updateObj));
      navigate('/profile/' + currentUser.id);
    }
  };

  const submitChangeBannerHandler = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('image', bannerUrl);

    if (bannerUrl) {
      const updateObj = {
        userId: currentUser.id,
        formData,
      };
      dispatch(updateBanner(updateObj));
      dispatch(getUser(currentUser.id));
      navigate('/profile/' + currentUser.id);
    }
  };

  const selectedAvatar = (e) => {
    setPhotoUrl(e.target.files[0]);
    setPreviewPhotoUrl(
      (prev) => (prev = URL.createObjectURL(e.target.files[0]))
    );
  };

  const selectedBanner = (e) => {
    setBannerUrl(e.target.files[0]);
    setPreviewBannerUrl(
      (prev) => (prev = URL.createObjectURL(e.target.files[0]))
    );
  };

  return (
    <div className="settings">
      <div className="profile-settings">
        <h5>Profile Settings:</h5>
        <div className="username-settings">
          <h6>Change Username</h6>
          <form className="form" onSubmit={submitChangeUserNameHandler}>
            <div>
              <label htmlFor="firstname">First Name</label>
              <input
                id="firstname"
                type="text"
                placeholder="Change Firstname"
                required
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </div>
            <div>
              <label htmlFor="familyname">Family Name</label>
              <input
                id="familyname"
                type="text"
                placeholder="Change Family Name"
                required
                onChange={(e) => setFamilyName(e.target.value)}
                value={familyName}
              />
            </div>
            <div>
              <label />
              <button className="secondary" type="submit">
                {/* {user && user.loading ? (
              <LoadingSmall width={20} height={15} />
            ) : (
              'Login'
            )} */}
                Change User Name
              </button>
            </div>
          </form>
        </div>

        <div>
          <h6>Change Profile Images</h6>
          <div className="profile-image-settings">
            <form className="form" onSubmit={submitChangeAvatarHandler}>
              <div className="avatar-form">
                <label htmlFor="avatar">Avatar</label>
                {photoUrl && (
                  <img
                    className="update-avatar"
                    style={{ width: '10rem', height: '10rem' }}
                    src={
                      typeof photoUrl === 'object'
                        ? previewPhotoUrl
                        : imageApi + photoUrl
                    }
                    alt="attachment"
                    // src={imageApi + preview}
                  />
                )}
                <div className="avatar-form-btns">
                  <input type="file" />
                  <label className="file-upload secondary">
                    <input
                      type="file"
                      onClick={(e) => {
                        e.target.value = null;
                      }}
                      onChange={selectedAvatar}
                      accept="image/png, image/jpeg, image/bmp, image/gif"
                    />
                    Choose a file
                  </label>
                  <div>
                    <label />
                    <button className="secondary" type="submit">
                      Update Avatar
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <form className="form" onSubmit={submitChangeBannerHandler}>
              <div className="banner-form">
                <label htmlFor="banner">Banner</label>
                {bannerUrl && (
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
                )}
                <div className="banner-form-btns">
                  <input type="file" />
                  <label className="file-upload secondary">
                    <input
                      type="file"
                      onClick={(e) => {
                        e.target.value = null;
                      }}
                      onChange={selectedBanner}
                      accept="image/png, image/jpeg, image/bmp, image/gif"
                    />
                    Choose a file
                  </label>
                  <div>
                    <label />
                    <button className="secondary" type="submit">
                      Update Banner
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="profile-info-settings">
          <h6>Change Profile Information</h6>
          <label>Skills (Press Enter To Add A Skill)</label>
          <div className="skills-input-container">
            {skills.map((skill, index) => (
              <div className="skill-item" key={index}>
                <span className="text">{skill}</span>
                <span
                  className="remove-skill"
                  onClick={() => removeSkill(index)}
                >
                  &times;
                </span>
              </div>
            ))}

            <input
              type="text"
              className="skills-input"
              placeholder="Add Skills"
              onKeyDown={handleKeyDown}
            />
          </div>
          <form className="form" onSubmit={submitProfileInfoHandler}>
            <div>
              <label htmlFor="bio">Bio</label>
              <input
                id="bio"
                type="text"
                placeholder="Change Bio"
                onChange={(e) => setBio(e.target.value)}
                value={bio ? bio : ''}
              />
            </div>

            <div>
              <label />
              <button className="secondary" type="submit">
                {/* {user && user.loading ? (
              <LoadingSmall width={20} height={15} />
            ) : (
              'Login'
            )} */}
                Change Profile Information
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="account-settings">
        <h5>Account Settings:</h5>
        <div className="password-settings">
          <h6>Change Password</h6>
          <form className="form" onSubmit={submitChangePasswordHandler}>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter a new password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label />
              <button className="secondary" type="submit">
                {/* {user && user.loading ? (
              <LoadingSmall width={20} height={15} />
            ) : (
              'Login'
            )} */}
                Change Password
              </button>
            </div>
          </form>
        </div>

        <div className="delete-account-settings">
          <h6>Delete Account</h6>
          <form className="form" onSubmit={submitDeleteHandler}>
            <div>
              <label htmlFor="deletePassword">Password</label>
              <input
                id="deletePassword"
                type="password"
                placeholder="Enter your password"
                required
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="delete-confirm-password">Confirm Password</label>
              <input
                id="delete-confirm-password"
                type="password"
                placeholder="Confirm your password"
                required
                onChange={(e) => setConfirmDeletePassword(e.target.value)}
              />
            </div>
            <div>
              <label />
              <button className="secondary" type="submit">
                {/* {user && user.loading ? (
              <LoadingSmall width={20} height={15} />
            ) : (
              'Login'
            )} */}
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
