import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getAllUsers, updateUserRole } from '../api/users';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    getAllUsers().then(setUsers).catch(() => setError('Could not load users'));
  }

  async function handleRoleChange(id, newRole) {
    try {
      await updateUserRole(id, newRole);
      loadUsers();
    } catch (err) {
      setError('Could not update role');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Manage Team Members</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white rounded-lg shadow divide-y">
          {users.map((u) => (
            <div key={u.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <select
                value={u.role}
                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="team_member">Team Member</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;