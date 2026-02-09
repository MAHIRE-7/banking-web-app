import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = isLogin ? await login(formData) : await register(formData);
      console.log('Login response:', data);
      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        console.log('Navigating to:', `/${data.role === 'superadmin' ? 'superadmin' : data.role}`);
        navigate(`/${data.role === 'superadmin' ? 'superadmin' : data.role}`);
      } else {
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || 'Error occurred');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
            required
          />
        )}
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </p>
    </div>
  );
}
