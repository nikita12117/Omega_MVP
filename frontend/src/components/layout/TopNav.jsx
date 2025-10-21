import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoOmega from '../brand/LogoOmega';

export const TopNav = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-cyan-950/5 border-b border-white/5">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14" role="navigation">
        <div className="flex items-center gap-3">
          <LogoOmega />
          <span className="text-slate-200 text-sm font-medium">Ω Aurora Codex</span>
        </div>
        <div className="flex items-center gap-6">
          <Link 
            to="/education" 
            data-testid="nav-education-link"
            className={`text-sm transition-colors duration-200 ${
              isActive('/education') 
                ? 'text-emerald-300 font-medium' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Education
          </Link>
          <Link 
            to="/demo" 
            data-testid="nav-demo-link"
            className={`text-sm transition-colors duration-200 ${
              isActive('/demo') 
                ? 'text-emerald-300 font-medium' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Demo
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default TopNav;