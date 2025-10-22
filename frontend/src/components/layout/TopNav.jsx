import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import LogoOmega from '../brand/LogoOmega';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const isActive = (path) => location.pathname === path;
  
  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]); // Re-check when location changes
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/auth/logout`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('omega_tokens');
      
      // Clear state
      setUser(null);
      
      toast.success('Odhlášení úspěšné');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear anyway on error
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('omega_tokens');
      setUser(null);
      toast.success('Odhlášení úspěšné');
      navigate('/login');
    }
  };
  
  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-cyan-950/5 border-b border-white/5">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14" role="navigation">
        <Link 
          to="/education" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          data-testid="nav-logo-link"
        >
          <LogoOmega />
          <span className="text-slate-200 text-sm font-medium">Ω Aurora Codex</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            to="/education" 
            data-testid="nav-education-link"
            className={`text-sm transition-colors duration-200 ${
              isActive('/education') 
                ? 'text-[hsl(var(--accent))] font-medium' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Education
          </Link>
          
          {/* Show Dashboard link only for admin users */}
          {user && user.is_admin && (
            <Link 
              to="/admin/overview" 
              data-testid="topnav-dashboard-link"
              className={`text-sm transition-colors duration-200 ${
                location.pathname.startsWith('/admin')
                  ? 'text-[hsl(var(--accent))] font-medium' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
          )}
          
          <Link 
            to="/demo" 
            data-testid="nav-demo-link"
            className={`text-sm transition-colors duration-200 ${
              isActive('/demo') 
                ? 'text-[hsl(var(--accent))] font-medium' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Demo
          </Link>
          
          {/* Show logout button only if user is logged in */}
          {user && (
            <>
              <div className="h-4 w-px bg-slate-700" /> {/* Separator */}
              <div className="flex items-center gap-3">
                <Link
                  to="/gdpr-settings"
                  className={`text-sm transition-colors duration-200 flex items-center gap-1 ${
                    isActive('/gdpr-settings')
                      ? 'text-[hsl(var(--accent))] font-medium' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                  data-testid="nav-gdpr-settings-link"
                  title="GDPR Nastavení"
                >
                  <Shield className="h-4 w-4" />
                </Link>
                <span className="text-xs text-slate-400">
                  {user.name || user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-slate-300 hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/10"
                  data-testid="logout-button"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Odhlásit
                </Button>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default TopNav;