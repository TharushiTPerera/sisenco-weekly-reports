import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyReports } from '../api/reports';
import { FileText, Plus } from 'lucide-react';

function statusStyle(status) {
  if (status === 'draft') return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  if (status === 'submitted') return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
  if (status === 'needs_correction') return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
  if (status === 'approved') return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
  return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
            <p className="text-sm text-gray-500 mt-1">{reports.length} report{reports.length !== 1 ? 's' : ''} submitted so far</p>
          </div>
          <Link
            to="/report/new"
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus size={15} /> New Report
          </Link>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {reports.length === 0 && (
          <div className="bg-white p-10 rounded-xl border border-gray-100 text-center">
            <FileText className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-gray-500 text-sm">You haven't created any reports yet.</p>
          </div>
        )}

        <div className="space-y-2">
          {reports.map((r) => {
            const style = statusStyle(r.status);
            return (
              <Link
                key={r.id}
                to={`/report/${r.id}`}
                className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.week_start} to {r.week_end}</p>
                    <p className="text-xs text-gray-400">Project #{r.project_id}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                  {r.status.replace('_', ' ')}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ReportHistory;