import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { SignUpPage } from './pages/SignUpPage';
import { HomePage } from './pages/HomePage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MenuProvider } from './contexts/MenuContext';
import { DarkModeProvider } from './contexts/DarkModeContext'; // Import the DarkModeProvider

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const DashboardRoute: React.FC = () => {
  const { role } = useAuth();
  return (
    <MenuProvider>
      {role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
    </MenuProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider> {/* Wrap the entire app with DarkModeProvider */}
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardRoute /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;