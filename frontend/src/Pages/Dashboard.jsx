import Navbar from '../components/Navbar';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Your role: {user?.role}</p>
      </div>
    </div>
  );
}

export default Dashboard;