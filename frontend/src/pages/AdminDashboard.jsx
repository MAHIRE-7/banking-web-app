import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAccounts, getAllTransactions, getFlaggedTransactions, updateAccountStatus } from '../services/api';

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [view, setView] = useState('accounts');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: accData } = await getAllAccounts();
      setAccounts(accData);
      const { data: txData } = await getAllTransactions();
      setTransactions(txData);
      const { data: flagData } = await getFlaggedTransactions();
      setFlagged(flagData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (accountNumber, status) => {
    try {
      await updateAccountStatus({ accountNumber, status });
      alert('Account status updated');
      loadData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ margin: '20px 0' }}>
        <button onClick={() => setView('accounts')} style={{ padding: '10px', margin: '5px' }}>Accounts</button>
        <button onClick={() => setView('transactions')} style={{ padding: '10px', margin: '5px' }}>Transactions</button>
        <button onClick={() => setView('flagged')} style={{ padding: '10px', margin: '5px' }}>Flagged ({flagged.length})</button>
      </div>

      {view === 'accounts' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#007bff', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Account Number</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Balance</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc._id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{acc.accountNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>${acc.balance}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{acc.status}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button onClick={() => handleStatusChange(acc.accountNumber, 'frozen')}>Freeze</button>
                  <button onClick={() => handleStatusChange(acc.accountNumber, 'active')}>Activate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {view === 'transactions' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#007bff', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Account</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Type</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Amount</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{tx.accountNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{tx.type}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>${tx.amount}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{tx.status}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(tx.timestamp).toLocaleString()}</td>
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
