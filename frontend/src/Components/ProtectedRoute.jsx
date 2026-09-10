import { Navigate } from 'react-router-dom';

// This component checks if the user is logged in.
// If yes, it shows whatever page is passed in.
// If no, it sends them back to /login.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;