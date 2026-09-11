import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportForm from './pages/ReportForm';
import ProtectedRoute from './components/ProtectedRoute';
import ReportDetail from './pages/ReportDetail';
import ReportHistory from './pages/ReportHistory';
import ManagerDashboard from './pages/ManagerDashboard';
import ProjectManagement from './pages/ProjectManagement';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/new"
          element={
            <ProtectedRoute>
              <ReportForm />
            </ProtectedRoute>
          }
        />
                <Route
          path="/report/:id"
          element={
            <ProtectedRoute>
              <ReportDetail />
            </ProtectedRoute>
          }
        />
                <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <ReportHistory />
            </ProtectedRoute>
          }
        />
                <Route
          path="/report/:id/edit"
          element={
            <ProtectedRoute>
              <ReportForm />
            </ProtectedRoute>
          }
        />
                <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
                <Route
          path="/manager/projects"
          element={
            <ProtectedRoute>
              <ProjectManagement />
            </ProtectedRoute>
          }
        />
                <Route
          path="/manager/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;