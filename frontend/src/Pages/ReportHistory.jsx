import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyReports } from '../api/reports';

function statusColor(status) {
  if (status === 'draft') return 'bg-gray-200 text-gray-700';
  if (status === 'submitted') return 'bg-blue-200 text-blue-700';
  if (status === 'needs_correction') return 'bg-red-200 text-red-700';
  if (status === 'approved') return 'bg-green-200 text-green-700';
  return 'bg-gray-200 text-gray-700';
}

function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyReports()
      .then((data) => setReports(data))
      .catch(() => setError('Could not load your reports'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Report History</h1>
          <Link
            to="/report/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            + New Report
          </Link>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {reports.length === 0 && (
          <p className="text-gray-500">You haven't created any reports yet.</p>
        )}

        <div className="space-y-3">
          {reports.map((r) => (
            <Link
              key={r.id}
              to={`/report/${r.id}`}
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{r.week_start} to {r.week_end}</p>
                  <p className="text-sm text-gray-500">Project ID: {r.project_id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(r.status)}`}>
                  {r.status.replace('_', ' ')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportHistory;