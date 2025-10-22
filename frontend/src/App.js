import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/App.css';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/gdpr/CookieConsent';
import Education from '@/pages/Education';
import AgentCreator from '@/pages/AgentCreator';
import DemoActivate from '@/pages/DemoActivate';
import Login from '@/pages/Login';
import TokenPurchase from '@/pages/TokenPurchase';
import Privacy from '@/pages/Privacy';
import GDPRSettings from '@/pages/GDPRSettings';
import ErrorPage from '@/pages/ErrorPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/pages/admin/AdminLayout';
import Overview from '@/pages/admin/Overview';
import Users from '@/pages/admin/Users';
import Settings from '@/pages/admin/Settings';

// Admin Guard Component
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user.is_admin) {
    return <Navigate to="/demo" replace />;
  }
  
  return children;
}

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <BrowserRouter>
        <TopNav />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/education" replace />} />
            <Route path="/education" element={<Education />} />
            <Route path="/demo/activate/:token" element={<DemoActivate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/demo" element={<Demo />} />
            <Route 
              path="/tokens" 
              element={
                <ProtectedRoute>
                  <TokenPurchase />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gdpr-settings" 
              element={
                <ProtectedRoute>
                  <GDPRSettings />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/overview" replace />} />
              <Route path="overview" element={<Overview />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<ErrorPage error={{message: 'Stránka nebyla nalezena'}} />} />
          </Routes>
        </div>
        <Footer />
        <CookieConsent />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))'
            }
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;