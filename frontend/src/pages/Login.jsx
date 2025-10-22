import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
const REDIRECT_URL = `${window.location.origin}/login`;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Check for session_id in URL fragment
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('session_id=')) {
      const sessionId = hash.split('session_id=')[1].split('&')[0];
      processSession(sessionId);
    }
  }, []);

  const processSession = async (sessionId) => {
    setIsProcessing(true);
    console.log('[Login] Processing session ID:', sessionId);
    
    try {
      const response = await apiClient.post('/auth/google/session', {
        session_id: sessionId
      });

      console.log('[Login] Session response:', response.data);

      // Shadow account created or existing user logged in
      if (response.data.status === 'success') {
        // Store auth data
        try {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('omega_tokens', response.data.omega_tokens_balance);
          console.log('[Login] Auth data stored in localStorage');
        } catch (storageError) {
          console.error('[Login] localStorage error:', storageError);
          toast.error('Chyba při ukládání přihlášení. Zkuste to prosím znovu.');
          setIsProcessing(false);
          return;
        }

        // Clean URL
        window.history.replaceState(null, '', '/login');

        toast.success(`Vítejte, ${response.data.user.name}!`);
        
        // Navigate based on user role
        setTimeout(() => {
          const targetUrl = response.data.user.is_admin ? '/admin/overview' : '/demo';
          console.log('[Login] Navigating to:', targetUrl);
          navigate(targetUrl);
        }, 500);
      }
    } catch (error) {
      console.error('[Login] Session processing error:', error);
      console.error('[Login] Error details:', error.response?.data);
      const errorMsg = error.response?.data?.detail || 'Přihlášení selhalo. Zkuste to prosím znovu.';
      toast.error(errorMsg);
      window.history.replaceState(null, '', '/login');
      setIsProcessing(false);
    }
  };

  const handleGoogleLogin = () => {
    const authBaseUrl = process.env.REACT_APP_AUTH_URL || 'https://auth.emergentagent.com';
    const authUrl = `${authBaseUrl}/?redirect=${encodeURIComponent(REDIRECT_URL)}`;
    window.location.href = authUrl;
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    console.log('[AdminLogin] Attempting admin login');

    try {
      const response = await apiClient.post('/auth/admin/login', {
        username: adminUsername,
        password: adminPassword
      });

      console.log('[AdminLogin] Login successful:', response.data);

      // Store auth data
      try {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('omega_tokens', response.data.omega_tokens_balance);
        console.log('[AdminLogin] Auth data stored');
      } catch (storageError) {
        console.error('[AdminLogin] localStorage error:', storageError);
        toast.error('Chyba při ukládání přihlášení. Zkuste to prosím znovu.');
        setIsProcessing(false);
        return;
      }

      toast.success('Admin přihlášení úspěšné!');
      
      // Admin always goes to dashboard
      console.log('[AdminLogin] Navigating to /admin/overview');
      navigate('/admin/overview');
    } catch (error) {
      console.error('[AdminLogin] Login error:', error);
      console.error('[AdminLogin] Error details:', error.response?.data);
      toast.error('Neplatné přihlašovací údaje');
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[rgb(10,10,31)] relative flex items-center justify-center">
        <div className="noise" />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--accent))]" />
          <p className="text-slate-300">Probíhá přihlášení...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(10,10,31)] relative">
      <div className="noise" />
      
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center min-h-screen px-4"
      >
        <Card className="w-full max-w-md bg-[hsl(var(--card))] border-[color:var(--border)] p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-12 h-12 text-[hsl(var(--accent))]" />
            </div>
            <h1 className="text-2xl font-bold text-[hsl(var(--accent))] mb-2">
              Ω Aurora Codex
            </h1>
            <p className="text-sm text-slate-400">
              Přihlaste se pro přístup k Demo
            </p>
          </div>

          {!showAdminLogin ? (
            <>
              {/* Google OAuth Button */}
              <Button
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-slate-900 font-medium mb-6"
                data-testid="google-login-button"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Přihlásit se přes Google
              </Button>

              <Separator className="my-6" />

              {/* Admin Login Toggle */}
              <div className="text-center">
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="text-sm text-slate-400 hover:text-[hsl(var(--accent))] transition-colors"
                >
                  Přihlásit jako admin
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Admin Login Form */}
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Username</label>
                  <Input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin"
                    className="bg-[hsl(var(--muted))] border-[color:var(--border)] text-slate-100"
                    required
                    data-testid="admin-username"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Password</label>
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-[hsl(var(--muted))] border-[color:var(--border)] text-slate-100"
                    required
                    data-testid="admin-password"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-11 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-slate-900"
                  data-testid="admin-login-submit"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Přihlásit'
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="text-center">
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="text-sm text-slate-400 hover:text-[hsl(var(--accent))] transition-colors"
                >
                  Zpět na Google přihlášení
                </button>
              </div>
            </>
          )}

          {/* Info */}
          <div className="mt-8 p-4 bg-[hsl(var(--muted))]/50 rounded-lg">
            <p className="text-xs text-slate-400 text-center">
              Při registraci obdržíte <span className="text-[hsl(var(--accent))] font-medium">{10000} Omega tokenů</span> zdarma<br/>
              (cca 2 agenty)
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
