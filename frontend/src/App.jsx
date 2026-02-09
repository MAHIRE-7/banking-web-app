import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!token) return <Navigate to="/login" />;
    if (!allowedRoles.includes(role)) return <Navigate to="/login" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/superadmin" element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
