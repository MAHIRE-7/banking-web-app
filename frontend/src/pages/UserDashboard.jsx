import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccount, getMyTransactions, createTransaction } from '../services/api';

export default function UserDashboard() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txForm, setTxForm] = useState({ type: 'deposit', amount: '', toAccountNumber: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: accData } = await getAccount();
      setAccount(accData);
      const { data: txData } = await getMyTransactions();
      setTransactions(txData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    try {
      await createTransaction({ ...txForm, amount: parseFloat(txForm.amount) });
      alert('Transaction completed');
      loadData();
      setTxForm({ type: 'deposit', amount: '', toAccountNumber: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Transaction failed');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>User Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>
      
      {account && (
        <div style={{ background: '#f0f0f0', padding: '20px', margin: '20px 0' }}>
          <h3>Account: {account.accountNumber}</h3>
          <p>Balance: ${account.balance.toFixed(2)}</p>
          <p>Status: {account.status}</p>
        </div>
      )}

      <div style={{ background: '#fff', padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
        <h3>New Transaction</h3>
        <form onSubmit={handleTransaction}>
          <select value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value })} style={{ padding: '10px', margin: '10px 0' }}>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={txForm.amount}
            onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
            style={{ padding: '10px', margin: '10px' }}
            required
          />
          {txForm.type === 'transfer' && (
            <input
              type="text"
              placeholder="To Account Number"
              value={txForm.toAccountNumber}
              onChange={(e) => setTxForm({ ...txForm, toAccountNumber: e.target.value })}
              style={{ padding: '10px', margin: '10px' }}
              required
            />
          )}
          <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none' }}>
            Submit
          </button>
        </form>
      </div>

      <h3>Transaction History</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#007bff', color: 'white' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Type</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Amount</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{tx.type}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>${tx.amount}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{tx.status}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(tx.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
