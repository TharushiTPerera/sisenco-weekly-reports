import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { FilePlus2, History, LayoutDashboard } from 'lucide-react';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManager = user?.role === 'manager';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{user?.role?.replace('_', ' ')}</p>
        </div>

        {isManager ? (
          <Link
            to="/manager/dashboard"
            className="flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-300 transition max-w-sm"
          >
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Team Dashboard</p>
              <p className="text-sm text-gray-500">View and review team reports</p>
            </div>
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/report/new"
              className="flex items-center gap-4 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <FilePlus2 size={22} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">New Weekly Report</p>
                <p className="text-sm text-gray-600">Start this week's report</p>
              </div>
            </Link>

            <Link
              to="/my-reports"
              className="flex items-center gap-4 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <History size={22} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Report History</p>
                <p className="text-sm text-gray-600">View past submissions</p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;