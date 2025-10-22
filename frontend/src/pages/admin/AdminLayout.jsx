import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Settings, Menu, Bot, MessageSquare, Brain, Activity, GitCommit, Lightbulb, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLayout() {
  const location = useLocation();
  
  const nav = [
    { label: 'Přehled', href: '/admin/overview', icon: LayoutDashboard, testid: 'sidebar-overview-link' },
    { label: 'Agent Monitor', href: '/admin/agents', icon: Bot, testid: 'sidebar-agents-link' },
    { label: 'Learning Loop', href: '/admin/learning', icon: Brain, testid: 'sidebar-learning-link' },
    { label: 'Live Monitor', href: '/admin/live', icon: Activity, testid: 'sidebar-live-link' },
    { label: 'Feedback', href: '/admin/feedback', icon: MessageSquare, testid: 'sidebar-feedback-link' },
    { label: 'Version Ledger', href: '/admin/versions', icon: GitCommit, testid: 'sidebar-versions-link' },
    { label: 'Meta Insights', href: '/admin/insights', icon: Lightbulb, testid: 'sidebar-insights-link' },
    { label: 'QR Tokeny', href: '/admin/qr', icon: QrCode, testid: 'sidebar-qr-link' },
    { label: 'Uživatelé', href: '/admin/users', icon: Users, testid: 'sidebar-users-link' },
    { label: 'Nastavení Platformy', href: '/admin/settings', icon: Settings, testid: 'sidebar-settings-link' }
  ];
  
  const isActive = (href) => location.pathname === href;
  
  const NavItems = () => (
    <nav className="space-y-1">
      {nav.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            to={item.href}
            data-testid={item.testid}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
              active
                ? 'bg-[rgb(6,214,160)]/10 text-[rgb(6,214,160)] border-l-2 border-[rgb(6,214,160)]'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
  
  return (
    <div className="min-h-screen bg-[rgb(10,15,29)] relative">
      <div className="noise" />
      
      <div className="grid grid-cols-1 lg:grid-cols-[18rem,1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block border-r border-slate-800/50 bg-[rgb(15,23,42)]/60">
          <div className="p-6 border-b border-slate-800/50">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-4">Admin Dashboard</div>
            <NavItems />
          </div>
        </aside>
        
        {/* Mobile top bar with sheet */}
        <div className="lg:hidden sticky top-0 z-20 border-b border-slate-800/50 bg-[rgb(15,23,42)]/90 backdrop-blur">
          <div className="flex items-center justify-between p-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm" data-testid="mobile-admin-menu-button">
                  <Menu className="h-4 w-4 mr-2" />
                  Menu
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[rgb(15,23,42)]">
                <div className="mt-6">
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-4 px-3">Admin Dashboard</div>
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Content column */}
        <main className="min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
