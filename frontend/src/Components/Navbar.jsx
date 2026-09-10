import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Sisenco Reports</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name} ({user?.role})
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;