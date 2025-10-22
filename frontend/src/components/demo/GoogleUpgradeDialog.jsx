import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const GoogleUpgradeDialog = ({ open, onOpenChange, user }) => {
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = () => {
    try {
      setUpgrading(true);
      
      // Redirect to Emergent Google OAuth
      const authUrl = process.env.REACT_APP_AUTH_URL || 'https://demobackend.emergentagent.com/auth/v1/env/oauth/google';
      const redirectUri = encodeURIComponent(window.location.origin + '/login');
      
      // Store intent to upgrade in sessionStorage
      sessionStorage.setItem('pending_upgrade', 'true');
      
      window.location.href = `${authUrl}?redirect_uri=${redirectUri}`;
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to start upgrade process');
      setUpgrading(false);
    }
  };

  const benefits = [
    { icon: Check, text: 'Keep all your generated prompts' },
    { icon: Check, text: 'No 72-hour expiry - unlimited access' },
    { icon: Check, text: 'Receive future updates and improvements' },
    { icon: Check, text: 'Priority support' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="google-upgrade-dialog">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <DialogTitle className="text-2xl">Save Your Progress</DialogTitle>
          </div>
          <DialogDescription>
            Upgrade to a full account and keep all your work
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Benefits List */}
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface-2 border border-border"
              >
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <benefit.icon className="h-4 w-4 text-accent" />
                </div>
                <p className="text-sm text-foreground">{benefit.text}</p>
              </div>
            ))}
          </div>

          {/* Current Progress */}
          {user && (
            <div className="p-4 rounded-lg bg-muted border border-border">
              <p className="text-sm text-muted-foreground mb-2">
                <strong className="text-foreground">Your current progress:</strong>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-accent">{user.prompt_count || 0}</span>
                  <span className="text-xs text-muted-foreground">Agents Created</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-accent">
                    {user.omega_tokens_balance?.toLocaleString() || '0'}
                  </span>
                  <span className="text-xs text-muted-foreground">Tokens Remaining</span>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <p className="text-xs text-muted-foreground text-center">
            We only use your email for account management. You can delete your account anytime.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={upgrading}
            className="w-full sm:w-auto"
            data-testid="google-upgrade-later-button"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="w-full sm:w-auto"
            data-testid="google-upgrade-confirm-button"
          >
            {upgrading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade with Google
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleUpgradeDialog;