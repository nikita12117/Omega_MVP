import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, BookOpen, Sparkles, LayoutDashboard, LogOut } from 'lucide-react';
import OmegaLogo from './OmegaLogo';
import { useAuth } from '../hooks/useAuth';

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { name: 'Education', path: '/education', icon: BookOpen },
    { name: 'Demo', path: '/demo', icon: Sparkles },
    ...(user?.is_admin ? [{ name: 'Dashboard', path: '/admin', icon: LayoutDashboard }] : [])
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-omega flex h-14 items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <OmegaLogo size={32} />
          <span className="font-bold text-lg hidden sm:inline-block">Ω Aurora Codex</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  className="gap-2"
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user.is_demo ? (
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                    Demo Account
                  </span>
                ) : (
                  user.email
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                data-testid="nav-logout-button"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm" data-testid="nav-login-button">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" data-testid="nav-mobile-menu-button">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-surface border-border">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        variant={isActive(item.path) ? 'default' : 'ghost'}
                        className="w-full justify-start gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
                {user && (
                  <>
                    <div className="border-t border-border my-2"></div>
                    <div className="px-3 py-2">
                      <p className="text-sm text-muted-foreground">
                        {user.is_demo ? 'Demo Account' : user.email}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;