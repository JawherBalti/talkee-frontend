import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { findUser } from '../features/user/userSlice';

const imageApi = 'http://localhost:3001/images/';
const timestampOption = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

function MoreResults() {
  const user = useSelector((state) => state.user);
  const [usersFound, setUsersFound] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    dispatch(findUser(param.searchValue));
    setUsersFound(user.usersFound.user);
    dispatch(findUser('thereisnothingtolookforherekekw'));
  }, [param.searchValue, dispatch]);

  const goToProfile = (id) => {
    navigate('/profile/' + id);
  };

  return (
    <div className="search-result user-posts">
      <h5>Results Found for "{param.searchValue}"</h5>
      {usersFound.map((user) => (
        <div
          className="user-search-result post"
          onClick={() => goToProfile(user.id)}
        >
          <img
            className="user-search-avatar"
            src={imageApi + user.photoUrl}
            alt="Avatar"
          ></img>
          <div>
            <h6>{user.firstName + ' ' + user.familyName}</h6>
            <p>
              <span>Joined: </span>
              {new Date(user.createdAt)
                .toLocaleDateString('us-US', timestampOption)
                .substring(0, 12)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MoreResults;
