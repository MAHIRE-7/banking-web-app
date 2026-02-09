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
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>SuperAdmin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ margin: '20px 0' }}>
        <button onClick={() => setView('users')} style={{ padding: '10px', margin: '5px' }}>Users</button>
        <button onClick={() => setView('accounts')} style={{ padding: '10px', margin: '5px' }}>Accounts</button>
        <button onClick={() => setView('flagged')} style={{ padding: '10px', margin: '5px' }}>Flagged ({flagged.length})</button>
        <button onClick={() => setView('create')} style={{ padding: '10px', margin: '5px' }}>Create Employee</button>
      </div>

      {view === 'create' && (
        <div style={{ background: '#f0f0f0', padding: '20px', maxWidth: '500px' }}>
          <h3>Create Employee</h3>
          <form onSubmit={handleCreateEmployee}>
            <input type="email" placeholder="Email" value={empForm.email} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} style={{ width: '100%', padding: '10px', margin: '10px 0' }} required />
            <input type="password" placeholder="Password" value={empForm.password} onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })} style={{ width: '100%', padding: '10px', margin: '10px 0' }} required />
            <input type="text" placeholder="Full Name" value={empForm.full_name} onChange={(e) => setEmpForm({ ...empForm, full_name: e.target.value })} style={{ width: '100%', padding: '10px', margin: '10px 0' }} required />
            <input type="text" placeholder="Employee ID" value={empForm.employee_id} onChange={(e) => setEmpForm({ ...empForm, employee_id: e.target.value })} style={{ width: '100%', padding: '10px', margin: '10px 0' }} required />
            <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none' }}>Create</button>
          </form>
        </div>
      )}

      {view === 'users' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#007bff', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.full_name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.status}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}>
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(user.id)} style={{ marginLeft: '5px', background: '#dc3545', color: 'white' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {view === 'accounts' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#007bff', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Account Number</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>User ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Balance</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc._id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{acc.accountNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{acc.userId}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>${acc.balance}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{acc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {view === 'flagged' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#dc3545', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Account</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Type</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Amount</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Fraud Score</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {flagged.map((tx) => (
              <tr key={tx._id} style={{ background: '#ffe6e6' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{tx.accountNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{tx.type}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>${tx.amount}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{tx.fraudScore}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(tx.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
