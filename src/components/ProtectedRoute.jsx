import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/selectors";

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectUser);

  if (!user.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;