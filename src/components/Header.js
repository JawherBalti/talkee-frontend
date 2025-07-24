import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { findUser, getCurrentUser, logout } from '../features/user/userSlice';
import LoadingLogo from './LoadingLogo';


function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [usersFound, setUsersFound] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setUsersFound(user.usersFound.user);
  }, [user.usersFound.user]);

  const showHideMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const toggleSearchBar = () => {
    const input = document.querySelector('.search-input');
    const icon = document.querySelector('.search-icon');
    setToggleSearch(!toggleSearch);
    if (toggleSearch) {
      dispatch(findUser('thereisnothingtolookforherekekw'));
      setSearchValue('');
      input.classList.remove('show');
      input.classList.add('hide');
      setTimeout(() => {
        input.style.display = 'none';
      }, 280);
      icon.style.color = '#6f6f6f';
    } else {
      input.classList.remove('hide');
      input.classList.add('show');
      setTimeout(() => {
        input.style.display = 'block';
      }, 200);
      icon.style.color = '#2b60d0';
    }
  };

  const userSearch = () => {
    if (searchValue !== '') {
      dispatch(findUser(searchValue));
    } else {
      dispatch(findUser('thereisnothingtolookforherekekw'));
    }
  };

  const resetMenu = () => {
    const input = document.querySelector('.search-input');
    const icon = document.querySelector('.search-icon');
    setToggleSearch(false);
    setSearchValue('');
    dispatch(findUser('thereisnothingtolookforherekekw'));
    input.classList.remove('show');
    input.classList.add('hide');
    setTimeout(() => {
      input.style.display = 'none';
    }, 280);
    icon.style.color = '#6f6f6f';
  };

  const goToProfile = (id) => {
    navigate('/profile/' + id);
  };

  return (
    <div className="header">
      {!isMobile && <div>
        <Link to="/" onClick={() => setToggleMenu(false)}>
          <div className="logo">
            <h1>T</h1>
            <LoadingLogo width={30} height={20} />
            <h1>lkee</h1>
          </div>
        </Link>
      </div>}
      {!user.userLogin.user ? (
        <ul className="links">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      ) : (
        <>
          <div className="nav-links">
            <div>
              <NavLink
                title="Explore"
                onClick={() => setToggleMenu(false)}
                to={`/explore`}
                style={({ isActive }) =>
                  isActive ? { color: '#2b60d0' } : { color: '#646464' }
                }
              >
                <i className="fas fa-compass explore"></i>
              </NavLink>
              <NavLink
                title="Home"
                onClick={() => setToggleMenu(false)}
                to="/"
                style={({ isActive }) =>
                  isActive ? { color: '#2b60d0' } : { color: '#646464' }
                }
              >
                <i className="fas fa-home feed"></i>
              </NavLink>
              <NavLink
                title="Profile"
                onClick={() => setToggleMenu(false)}
                to={`/profile/${user.userLogin.user?.id}`}
                style={({ isActive }) =>
                  isActive ? { color: '#2b60d0' } : { color: '#646464' }
                }
              >
                <i className="fa fa-solid fa-user profile"></i>
              </NavLink>

              <NavLink
                title="Messages"
                onClick={() => setToggleMenu(false)}
                to={`/messages`}
                style={({ isActive }) =>
                  isActive ? { color: '#2b60d0' } : { color: '#646464' }
                }
              >
                <i className="fas fa-comments messages"></i>
              </NavLink>

              <div className="search-bar">
                <i
                  className="fas fa-search search-icon"
                  onClick={toggleSearchBar}
                ></i>
                <input
                  className="search-input hide"
                  type="text"
                  placeholder="Find Other People"
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyUp={userSearch}
                  value={searchValue}
                />
                {usersFound?.length ? (
                  <ul className="users-found">
                    {usersFound.slice(0, 5).map((user) => (
                      <li
                        className="user-found"
                        key={user.id}
                        onClick={() => goToProfile(user.id)}
                      >
                        <img
                          className="avatar"
                          src={user?.photoUrl}
                          alt="Avatar"
                        />
                        <span>{user.firstName}</span>
                        <span> {user.familyName}</span>
                      </li>
                    ))}
                    {usersFound?.length > 5 ? (
                      <Link onClick={resetMenu} to={`/more/${searchValue}`}>
                        <span>More Results</span>
                      </Link>
                    ) : null}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
          <div className="account">
            {user?.currentUser?.user?.photoUrl && (
              <img
                onClick={showHideMenu}
                className="avatar"
                src={user.currentUser.user.photoUrl}
                alt=""
              />
            )}
            {toggleMenu ? (
              <ul className="account-menu">
                <li>
                  <Link to="/settings" onClick={() => setToggleMenu(false)}>
                    <i className="fas fa-user-cog"></i>
                    <span> Settings</span>
                  </Link>
                </li>
                {user.currentUser.user?.role ? (
                  <li>
                    <Link to="/admin" onClick={() => setToggleMenu(false)}>
                      <i className="fas fa-user-shield"></i>
                      <span>Admin</span>
                    </Link>
                  </li>
                ) : null}

                <li>
                  <Link
                    onClick={() => {
                      document.cookie =
                        'snToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                      dispatch(logout());
                      setToggleMenu(false);
                    }}
                    to="/login"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span> Logout</span>
                  </Link>
                </li>
              </ul>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
