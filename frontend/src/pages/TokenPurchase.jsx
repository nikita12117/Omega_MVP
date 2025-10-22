import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Coins, Lock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    tokens: 10000,
    agents: 2,
    price: 99,
    priceKey: 'locked_price_99',
    description: 'Perfektní pro vyzkoušení'
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    tokens: 35000,
    agents: 7,
    price: 399,
    priceKey: 'locked_price_399',
    description: 'Nejoblíbenější volba',
    popular: true
  }
];

export default function TokenPurchase() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const tokens = localStorage.getItem('omega_tokens');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (tokens) {
      setCurrentBalance(parseInt(tokens));
    }
  }, []);

  const handlePurchase = (pkg) => {
    // Placeholder for GoPay integration
    toast.info('GoPay integrace bude brzy k dispozici!', {
      description: `Balíček: ${pkg.name} za ${pkg.price} Kč`
    });
  };

  const getUserPrice = (pkg) => {
    if (!user) return pkg.price;
    
    // Check if user has locked price
    if (pkg.priceKey === 'locked_price_99' && user.locked_price_99) {
      return user.locked_price_99;
    }
    if (pkg.priceKey === 'locked_price_399' && user.locked_price_399) {
      return user.locked_price_399;
    }
    
    return pkg.price;
  };

  const hasLockedPrice = (pkg) => {
    if (!user) return false;
    return (pkg.priceKey === 'locked_price_99' && user.locked_price_99) ||
           (pkg.priceKey === 'locked_price_399' && user.locked_price_399);
  };

  return (
    <div className="min-h-screen bg-[rgb(10,10,31)] relative">
      <div className="noise" />
      
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/demo')}
          className="text-slate-400 hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/10 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zpět na Demo
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[hsl(var(--accent))] mb-3">
            Omega Tokeny
          </h1>
          <p className="text-slate-300 mb-6">
            Získejte více tokenů pro generování agentů
          </p>
          
          {/* Current Balance */}
          <Card className="inline-block bg-[hsl(var(--card))] border-[color:var(--border)] px-6 py-4">
            <div className="flex items-center gap-3">
              <Coins className="h-5 w-5 text-[hsl(var(--accent))]" />
              <div className="text-left">
                <div className="text-xs text-slate-400">Aktuální zůstatek</div>
                <div className="text-2xl font-bold text-[hsl(var(--accent))]">
                  {currentBalance.toLocaleString()} tokenů
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Packages */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {PACKAGES.map((pkg) => {
            const userPrice = getUserPrice(pkg);
            const isLocked = hasLockedPrice(pkg);
            
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.1 }}
              >
                <Card className={`bg-[hsl(var(--card))] border-[color:var(--border)] p-6 h-full flex flex-col relative ${
                  pkg.popular ? 'ring-2 ring-[hsl(var(--accent))]/30' : ''
                }`}>
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[hsl(var(--accent))] text-slate-900">
                      Nejoblíbenější
                    </Badge>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-100 mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {pkg.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Tokeny</span>
                        <span className="text-[hsl(var(--accent))] font-bold">
                          {pkg.tokens.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">≈ Agentů</span>
                        <span className="text-[hsl(var(--accent))] font-bold">
                          {pkg.agents}
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-[hsl(var(--accent))]">
                        {userPrice} Kč
                      </div>
                      {isLocked && (
                        <div className="flex items-center justify-center gap-1 mt-2 text-sm text-slate-400">
                          <Lock className="h-3 w-3" />
                          <span>Vaše cena navždy</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(pkg)}
                    className={`w-full h-11 ${
                      pkg.popular 
                        ? 'bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-slate-900'
                        : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 text-slate-100'
                    }`}
                    data-testid={`purchase-${pkg.id}`}
                  >
                    Koupit nyní
                  </Button>
                  
                  {!isLocked && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-3 justify-center">
                      <TrendingUp className="h-3 w-3" />
                      <span>Nákupem dnes zamknete cenu navždy</span>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info */}
        <Card className="bg-[hsl(var(--muted))]/30 border-[color:var(--border)] p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Informace o tokenech</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              • <strong>1 Omega token = 1 OpenAI token</strong> - platíte přesně za to, co použijete
            </p>
            <p>
              • <strong>Průměrná spotřeba:</strong> ~5000 tokenů na jednoho vygenerovaného agenta (3 stages)
            </p>
            <p>
              • <strong>Zamknutá cena:</strong> Při prvním nákupu balíčku se jeho cena zamkne navždy jen pro tento balíček
            </p>
            <p>
              • <strong>Přenesení tokenů:</strong> Tokeny nikdy nevyprší a jsou přenosné mezi sessions
            </p>
            <p>
              • <strong>Platební brána:</strong> GoPay - bezpečné online platby kartou nebo bankovním převodem
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
