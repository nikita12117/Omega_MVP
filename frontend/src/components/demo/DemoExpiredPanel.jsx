import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, Clock, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OmegaLogo from '../OmegaLogo';

export const DemoExpiredPanel = ({ user }) => {
  const navigate = useNavigate();

  const handleGoogleUpgrade = () => {
    // Trigger Google OAuth flow via Emergent Auth
    const authUrl = process.env.REACT_APP_AUTH_URL || 'https://demobackend.emergentagent.com/auth/v1/env/oauth/google';
    const redirectUri = encodeURIComponent(window.location.origin + '/login');
    window.location.href = `${authUrl}?redirect_uri=${redirectUri}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8 md:p-12 bg-surface border-border" data-testid="demo-expired-panel">
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-warning/20 flex items-center justify-center">
                <Clock className="h-10 w-10 text-warning" />
              </div>
              <OmegaLogo size={48} className="opacity-50" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Demo Period Expired
              </h1>
              <p className="text-lg text-muted-foreground">
                Your 72-hour demo access has ended
              </p>
            </div>

            <div className="p-6 rounded-lg bg-muted border border-border text-left">
              <p className="text-sm text-muted-foreground mb-4">
                <strong className="text-foreground">Your demo account generated:</strong>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-accent">{user?.prompt_count || 0}</span>
                  <span className="text-xs text-muted-foreground">AI Agents</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-accent">{user?.tokens_used?.toLocaleString() || '0'}</span>
                  <span className="text-xs text-muted-foreground">Tokens Used</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="p-6 rounded-lg bg-surface-2 border border-accent/30">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <p className="font-semibold text-foreground">Upgrade to Keep Your Progress</p>
                </div>
                <ul className="text-left text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>Save all your generated prompts forever</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>No 72-hour expiry - unlimited access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>Receive updates and new features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>Priority support and advanced features</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleGoogleUpgrade}
                  size="lg"
                  className="w-full"
                  data-testid="demo-expired-upgrade-button"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Upgrade with Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/education')}
                  className="w-full"
                  data-testid="demo-expired-education-button"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explore Education
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Have questions? Contact our support team
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DemoExpiredPanel;