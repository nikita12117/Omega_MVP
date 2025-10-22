import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Sparkles, Clock, Coins, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OmegaLogo from '../OmegaLogo';

export const DemoActivationPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8 md:p-12 bg-surface border-border" data-testid="demo-activation-prompt">
          <div className="text-center space-y-6">
            <OmegaLogo size={80} className="mx-auto animate-pulse-glow" />
            
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Scan QR Code to Activate
              </h1>
              <p className="text-lg text-muted-foreground">
                Get instant access to the Omega Agent Generator
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-surface-2 border border-border">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">100,000 Tokens</p>
                  <p className="text-sm text-muted-foreground">Generate multiple agents</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-surface-2 border border-border">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">72 Hours</p>
                  <p className="text-sm text-muted-foreground">Full access period</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-surface-2 border border-border">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Instant Setup</p>
                  <p className="text-sm text-muted-foreground">No registration needed</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="p-6 rounded-lg bg-muted border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  <strong className="text-foreground">How it works:</strong>
                </p>
                <ol className="text-left text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">1</span>
                    <span>Scan the QR code at the conference booth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">2</span>
                    <span>Your demo account activates automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">3</span>
                    <span>Start generating optimized AI agent prompts</span>
                  </li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/education')}
                  className="flex-1"
                  data-testid="demo-view-education-button"
                >
                  Learn More
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  className="flex-1"
                  data-testid="demo-full-account-button"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Full Account
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DemoActivationPrompt;