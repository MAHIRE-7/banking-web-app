import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

export const getAccount = () => API.get('/accounts/my-account');
export const getAllAccounts = () => API.get('/accounts/all');
export const updateAccountStatus = (data) => API.put('/accounts/status', data);

export const createTransaction = (data) => API.post('/transactions', data);
export const getMyTransactions = () => API.get('/transactions/my-transactions');
export const getAllTransactions = () => API.get('/transactions/all');
export const getFlaggedTransactions = () => API.get('/transactions/flagged');

export const getAllUsers = () => API.get('/users');
export const createEmployee = (data) => API.post('/users/employee', data);
export const updateUserStatus = (data) => API.put('/users/status', data);
export const deleteUser = (userId) => API.delete(`/users/${userId}`);
