import { Navigate, useLocation } from "react-router-dom";
import { authStorage } from "../services/authStorage";

type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = authStorage.getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
