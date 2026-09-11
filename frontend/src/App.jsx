import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportForm from './pages/ReportForm';
import ProtectedRoute from './components/ProtectedRoute';
import ReportDetail from './pages/ReportDetail';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;