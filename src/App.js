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
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user.userLogin.id) {
      dispatch(getCurrentUser(user.userLogin.id));
    }
  }, [user.userLogin.id, dispatch]);

return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={user.isLoggedIn ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user.isLoggedIn ? <Navigate to="/" /> : <Signup />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/more/:searchValue" element={<MoreResults />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/user/:id" element={<AdminSettings />} />
          </Route>

          {/* Blocked user */}
          <Route path="/blocked" element={<BlockedUser />} />

          {/* Fallback routes */}
          <Route path="*" element={<Navigate to={user.isLoggedIn ? "/" : "/login"} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
