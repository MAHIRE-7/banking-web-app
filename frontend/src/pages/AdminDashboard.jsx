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
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>Admin Dashboard</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Monitor accounts and transactions</p>
          </div>
          <button onClick={logout} style={{ background: '#ff4757', color: 'white' }}>Logout</button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <button onClick={() => setView('accounts')} style={{ background: view === 'accounts' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff', color: view === 'accounts' ? 'white' : '#333' }}>
            📊 Accounts
          </button>
          <button onClick={() => setView('transactions')} style={{ background: view === 'transactions' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff', color: view === 'transactions' ? 'white' : '#333' }}>
            💳 Transactions
          </button>
          <button onClick={() => setView('flagged')} style={{ background: view === 'flagged' ? '#ff4757' : '#fff', color: view === 'flagged' ? 'white' : '#333' }}>
            🚨 Flagged ({flagged.length})
          </button>
        </div>

        {view === 'accounts' && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }}>All Accounts</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Account Number</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Balance</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc, idx) => (
                  <tr key={acc._id} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{acc.accountNumber}</td>
                    <td style={{ padding: '16px', color: '#10ac84', fontWeight: '700' }}>${acc.balance}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: acc.status === 'active' ? '#d4edda' : '#f8d7da', color: acc.status === 'active' ? '#155724' : '#721c24' }}>
                        {acc.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button onClick={() => handleStatusChange(acc.accountNumber, 'frozen')} style={{ background: '#ff6b6b', color: 'white', marginRight: '8px', padding: '6px 12px', fontSize: '12px' }}>Freeze</button>
                      <button onClick={() => handleStatusChange(acc.accountNumber, 'active')} style={{ background: '#10ac84', color: 'white', padding: '6px 12px', fontSize: '12px' }}>Activate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'transactions' && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }}>All Transactions</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Account</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={tx._id} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{tx.accountNumber}</td>
                    <td style={{ padding: '16px', textTransform: 'capitalize' }}>{tx.type}</td>
                    <td style={{ padding: '16px', color: '#10ac84', fontWeight: '700' }}>${tx.amount}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: tx.status === 'completed' ? '#d4edda' : tx.status === 'flagged' ? '#f8d7da' : '#fff3cd', color: tx.status === 'completed' ? '#155724' : tx.status === 'flagged' ? '#721c24' : '#856404' }}>
                        {tx.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#666', fontSize: '14px' }}>{new Date(tx.timestamp).toLocaleString()}</td>
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
