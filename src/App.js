import './App.css';
import Header from './components/Header';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './views/Login';
import Signup from './views/Signup';
import Footer from './components/Footer';
import Home from './views/Home';
import Profile from './views/Profile';
import Settings from './views/Settings';
import PrivateRoute from './components/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import Admin from './views/Admin';
import AdminSettings from './views/AdminSettings';
import AdminRoute from './components/AdminRoute';
import MoreResults from './views/MoreResults';
import BlockedUser from './views/BlockedUser';
import { useEffect } from 'react';
import { getCurrentUser } from './features/user/userSlice';
import Explore from './views/Explore';
import Messages from './views/Messages';

function App() {
  // {!user.isLoggedIn ? (
  //       <Route path="/login" element={<Login />} />
  // ) : ()
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser(user.userLogin.id));
  }, [user.userLogin, dispatch]);

  return (
    <div className="app">
      <header>
        <Header></Header>
      </header>
      <main>
        {!user.isLoggedIn ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />}></Route>
            <Route exact path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : !user.currentUser.user?.isBlocked ? (
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route exact path="/" element={<Home />} />
            </Route>

            {/* <Route path="/login" element={<Login />} /> */}

            <Route path="/signup" element={<Signup />}></Route>

            <Route element={<PrivateRoute />}>
              <Route exact path="/profile/:id" element={<Profile />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route exact path="/explore" element={<Explore />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route exact path="/messages" element={<Messages />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/settings" element={<Settings />}></Route>
            </Route>

            <Route element={<PrivateRoute />}>
              <Route
                path="/more/:searchValue"
                element={<MoreResults />}
              ></Route>
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />}></Route>
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin/user/:id" element={<AdminSettings />}></Route>
            </Route>
            {/* <Route path="*" element={<PageNotFound />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <BlockedUser />
        )}
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
}

export default App;
