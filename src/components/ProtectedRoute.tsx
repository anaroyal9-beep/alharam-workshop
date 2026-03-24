import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuth = sessionStorage.getItem("auth") === "true";
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
