import { useState } from 'react';
import { Link } from 'react-router-dom'
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  // These hold whatever the user types into the two boxes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const navigate = useNavigate();
  const [error, setError] = useState('');

  // This runs when the user clicks the Login button
    async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard'); // we'll build this page soon
    } catch (err) {
      setError('Invalid email or password');
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
                <p className="text-sm text-center mt-4">
          Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;