import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, createEmployee, updateUserStatus, deleteUser, getAllAccounts, getFlaggedTransactions } from '../services/api';

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [view, setView] = useState('users');
  const [empForm, setEmpForm] = useState({ email: '', password: '', full_name: '', employee_id: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: userData } = await getAllUsers();
      setUsers(userData);
      const { data: accData } = await getAllAccounts();
      setAccounts(accData);
      const { data: flagData } = await getFlaggedTransactions();
      setFlagged(flagData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(empForm);
      alert('Employee created');
      loadData();
      setEmpForm({ email: '', password: '', full_name: '', employee_id: '' });
    } catch (error) {
      alert('Failed to create employee');
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await updateUserStatus({ userId, status });
      alert('User status updated');
      loadData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Delete this user?')) {
      try {
        await deleteUser(userId);
        alert('User deleted');
        loadData();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>SuperAdmin Dashboard</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Manage users, employees, and system</p>
          </div>
          <button onClick={logout} style={{ background: '#ff4757', color: 'white' }}>Logout</button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <button onClick={() => setView('users')} style={{ background: view === 'users' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff', color: view === 'users' ? 'white' : '#333' }}>
            👥 Users
          </button>
          <button onClick={() => setView('accounts')} style={{ background: view === 'accounts' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff', color: view === 'accounts' ? 'white' : '#333' }}>
            📊 Accounts
          </button>
          <button onClick={() => setView('flagged')} style={{ background: view === 'flagged' ? '#ff4757' : '#fff', color: view === 'flagged' ? 'white' : '#333' }}>
            🚨 Flagged ({flagged.length})
          </button>
          <button onClick={() => setView('create')} style={{ background: view === 'create' ? '#10ac84' : '#fff', color: view === 'create' ? 'white' : '#333' }}>
            ➕ Create Employee
          </button>
        </div>

        {view === 'create' && (
          <div className="card" style={{ maxWidth: '600px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }}>Create New Employee</h3>
            <form onSubmit={handleCreateEmployee}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>Email</label>
                <input type="email" placeholder="employee@bank.com" value={empForm.email} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>Password</label>
                <input type="password" placeholder="Enter password" value={empForm.password} onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })} required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>Full Name</label>
                <input type="text" placeholder="John Doe" value={empForm.full_name} onChange={(e) => setEmpForm({ ...empForm, full_name: e.target.value })} required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>Employee ID</label>
                <input type="text" placeholder="EMP001" value={empForm.employee_id} onChange={(e) => setEmpForm({ ...empForm, employee_id: e.target.value })} required />
              </div>
              <button type="submit" style={{ background: '#10ac84', color: 'white', width: '100%' }}>Create Employee</button>
            </form>
          </div>
        )}

        {view === 'users' && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }}>All Users</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                    <td style={{ padding: '16px' }}>{user.email}</td>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{user.full_name}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: user.role === 'superadmin' ? '#e3f2fd' : user.role === 'admin' ? '#fff3e0' : '#f3e5f5', color: user.role === 'superadmin' ? '#1565c0' : user.role === 'admin' ? '#e65100' : '#6a1b9a' }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: user.status === 'active' ? '#d4edda' : '#f8d7da', color: user.status === 'active' ? '#155724' : '#721c24' }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')} style={{ background: user.status === 'active' ? '#ffa502' : '#10ac84', color: 'white', marginRight: '8px', padding: '6px 12px', fontSize: '12px' }}>
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDelete(user.id)} style={{ background: '#ff4757', color: 'white', padding: '6px 12px', fontSize: '12px' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'accounts' && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }}>All Accounts</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Account Number</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>User ID</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Balance</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc, idx) => (
                  <tr key={acc._id} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{acc.accountNumber}</td>
                    <td style={{ padding: '16px' }}>{acc.userId}</td>
                    <td style={{ padding: '16px', color: '#10ac84', fontWeight: '700' }}>${acc.balance}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: acc.status === 'active' ? '#d4edda' : '#f8d7da', color: acc.status === 'active' ? '#155724' : '#721c24' }}>
                        {acc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'flagged' && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#ff4757' }}>🚨 Flagged Transactions</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#ff4757', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Account</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Fraud Score</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {flagged.map((tx, idx) => (
                  <tr key={tx._id} style={{ borderBottom: '1px solid #f0f0f0', background: '#fff5f5' }}>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{tx.accountNumber}</td>
                    <td style={{ padding: '16px', textTransform: 'capitalize' }}>{tx.type}</td>
                    <td style={{ padding: '16px', color: '#ff4757', fontWeight: '700' }}>${tx.amount}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: '#ff4757', color: 'white' }}>
                        {tx.fraudScore}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#666', fontSize: '14px' }}>{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
