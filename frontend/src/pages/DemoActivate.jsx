import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import OmegaLogo from '../components/OmegaLogo';
import axios from '../lib/axios';

export const DemoActivate = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const ref = searchParams.get('ref'); // Referral code

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('No activation token provided');
      return;
    }

    activateDemoAccount();
  }, [token]);

  const activateDemoAccount = async () => {
    try {
      setStatus('loading');
      
      const payload = { token };
      if (ref) {
        payload.ref = ref;
      }

      const { data } = await axios.post('/api/demo/activate', payload);
      
      // Store JWT token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setStatus('success');
      
      // Redirect to demo page after 1.5 seconds
      setTimeout(() => {
        navigate('/demo', { replace: true });
      }, 1500);
    } catch (error) {
      setStatus('error');
      
      if (error.response) {
        const { status: httpStatus, data } = error.response;
        
        if (httpStatus === 404) {
          setErrorMessage('This activation link is invalid or does not exist.');
        } else if (httpStatus === 400) {
          if (data.detail?.includes('expired')) {
            setErrorMessage('This activation link has expired.');
          } else if (data.detail?.includes('Maximum activations')) {
            setErrorMessage('This activation link has been fully used.');
          } else {
            setErrorMessage(data.detail || 'Activation failed. Please try again.');
          }
        } else if (httpStatus === 429) {
          setErrorMessage('Too many activation attempts. Please try again later.');
        } else {
          setErrorMessage('Activation failed. Please try again.');
        }
      } else {
        setErrorMessage('Connection failed. Please check your internet and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="noise"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-surface border-border">
          <div className="flex flex-col items-center text-center space-y-6">
            <OmegaLogo size={64} className="animate-pulse-glow" />
            
            {status === 'loading' && (
              <>
                <div data-testid="demo-activate-loading" className="space-y-3">
                  <h2 className="text-2xl font-bold text-foreground">Activating Demo Account</h2>
                  <p className="text-muted-foreground">Creating your personalized AI workspace...</p>
                </div>
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-accent animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                data-testid="demo-activate-success"
                className="space-y-4"
              >
                <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Demo Account Activated!</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">100,000 tokens credited</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-muted-foreground">Valid for 72 hours</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Redirecting to your Omega generator...</p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                data-testid="demo-activate-error"
                className="space-y-4"
              >
                <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Activation Failed</h2>
                <p className="text-muted-foreground">{errorMessage}</p>
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/education')}
                    className="flex-1"
                    data-testid="demo-activate-education-button"
                  >
                    View Education
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    className="flex-1"
                    data-testid="demo-activate-retry-button"
                  >
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          Powered by Ω Aurora Codex
        </p>
      </motion.div>
    </div>
  );
};

export default DemoActivate;