import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { blockUser, getAllUsers } from '../features/user/userSlice';

const imageApi = 'http://localhost:3001/images/';

const timestampOption = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

function Admin() {
  const user = useSelector((state) => state.user);
  //const deleteReducer = useSelector(state => state.adminDeleteReducer)
  //const { errorDelete, successDelete, loadingDelete } = deleteReducer

  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(8);

  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const [searchValue, setSearchValue] = useState('');
  const [itemsList, setItemsList] = useState(0);
  const [sortOption, setSortOption] = useState('role');

  const lastOrder = currentPage * usersPerPage;
  const firstOrder = lastOrder - usersPerPage;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!user.userLogin.user) {
    navigate('/login');
  }

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch, user.updatedUser]);

  useEffect(() => {
    setUserList(user.users);
    setItemsList(user.users.length);
  }, [user.users]);

  const updateHandler = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const blockHandler = (user) => {
    const updateObj = {
      userId: user.id,
      formData: {
        block: !user.isBlocked,
      },
    };
    dispatch(blockUser(updateObj));
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextbtn = () => {
    setCurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  const searchHandler = (e) => {
    setSearchValue(e.target.value);
    setItemsList(
      userList.filter(
        (user) =>
          user.firstName.includes(e.target.value) ||
          user.familyName.includes(e.target.value)
      ).length
    );
  };

  const changeSortOption = (option) => {
    setSortOption(option);
  };

  const sortByCases = (data) => {
    const sortedData = [...data];

    if (sortOption === 'role') {
      sortedData.sort((a, b) => {
        if (a.role > b.role) {
          return -1;
        } else {
          return 1;
        }

        //or return a.cases - b.cases
      });
    } else if (sortOption === 'firstName') {
      sortedData.sort((a, b) => {
        if (a.firstName < b.firstName) {
          return -1;
        } else {
          return 1;
        }

        //or return a.cases - b.cases
      });
    } else if (sortOption === 'familyName') {
      sortedData.sort((a, b) => {
        if (a.familyName < b.familyName) {
          return -1;
        } else {
          return 1;
        }

        //or return a.cases - b.cases
      });
    } else if (sortOption === 'email') {
      sortedData.sort((a, b) => {
        if (a.email < b.email) {
          return -1;
        } else {
          return 1;
        }

        //or return a.cases - b.cases
      });
    } else if (sortOption === 'createdAt') {
      sortedData.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return -1;
        } else {
          return 1;
        }

        //or return a.cases - b.cases
      });
    }
    return sortedData;
  };

  return (
    <div className="admin">
      <div className="filter">
        <input type="text" onChange={searchHandler} placeholder="Find user" />
        <select onChange={(e) => changeSortOption(e.target.value)}>
          <option value="role">Sort By</option>
          <option value="role">Role</option>
          <option value="createdAt">Creation Date</option>
          <option value="firstName">First Name</option>
          <option value="familyName">Family Name</option>
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>First Name</th>
            <th>Family Name</th>
            <th>Email</th>
            <th>Creation Date</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Block</th>
          </tr>
        </thead>
        <tbody>
          {sortByCases(userList)
            .slice(firstOrder, lastOrder)
            .filter((user) => {
              return (
                user.firstName
                  .toLowerCase()
                  .indexOf(searchValue.toLowerCase()) !== -1 ||
                user.familyName
                  .toLowerCase()
                  .indexOf(searchValue.toLowerCase()) !== -1
              );
            })
            .map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    className="avatar"
                    src={imageApi + user.photoUrl}
                    alt="Avatar"
                  />
                </td>
                <td>{user.firstName}</td>
                <td>{user.familyName}</td>
                <td>{user.email}</td>
                <td>
                  {new Date(user.createdAt)
                    .toLocaleDateString('us-US', timestampOption)
                    .substring(0, 12)}
                </td>
                <td>{user.role ? 'Admin' : 'User'}</td>
                <td>
                  <button
                    type="button"
                    className="secondary"
                    onClick={(e) => updateHandler(user.id)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  {!user.role && !user.isBlocked ? (
                    <button
                      type="button"
                      className="danger"
                      onClick={() => blockHandler(user)}
                    >
                      Block
                    </button>
                  ) : !user.role && user.isBlocked ? (
                    <button
                      type="button"
                      className="primary"
                      onClick={() => blockHandler(user)}
                    >
                      Unblock
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        itemsPerPage={usersPerPage}
        totalItems={itemsList}
        paginate={paginate}
        currentPage={currentPage}
        maxPageNumberLimit={maxPageNumberLimit}
        minPageNumberLimit={minPageNumberLimit}
        handleNextbtn={handleNextbtn}
        handlePrevbtn={handlePrevbtn}
      ></Pagination>
    </div>
  );
}

export default Admin;
