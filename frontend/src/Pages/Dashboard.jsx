import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mb-4">Your role: {user?.role}</p>
        <Link
          to="/report/new"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Weekly Report
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;