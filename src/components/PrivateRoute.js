import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { isLoggedIn, currentUser } = useSelector((state) => state.user);

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (currentUser.user?.isBlocked) return <Navigate to="/blocked" />;
  return <Outlet />;
}