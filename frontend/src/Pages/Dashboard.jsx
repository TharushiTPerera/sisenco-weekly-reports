import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManager = user?.role === 'manager';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mb-4">Your role: {user?.role}</p>
        <div className="flex gap-3">
          {isManager ? (
            <Link
              to="/manager/dashboard"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Team Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/report/new"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + New Weekly Report
              </Link>
              <Link
                to="/my-reports"
                className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                My Report History
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;