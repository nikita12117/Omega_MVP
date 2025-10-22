import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X, Cookie, Shield } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem('gdpr_consent');
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      const parsed = JSON.parse(savedConsent);
      setConsent(parsed);
      initializeScripts(parsed);
    }
  }, []);

  const initializeScripts = (consentData) => {
    // Initialize analytics if consented
    if (consentData.analytics) {
      // Google Analytics or other analytics
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'consent_granted_analytics' });
      }
    }

    // Initialize marketing if consented
    if (consentData.marketing) {
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'consent_granted_marketing' });
      }
    }
  };

  const blockScripts = (category) => {
    if (category === 'analytics' && window.dataLayer) {
      window.dataLayer.push({ event: 'consent_revoked_analytics' });
    }
    if (category === 'marketing' && window.dataLayer) {
      window.dataLayer.push({ event: 'consent_revoked_marketing' });
    }
  };

  const saveConsent = (consentData) => {
    localStorage.setItem('gdpr_consent', JSON.stringify(consentData));
    localStorage.setItem('gdpr_consent_date', new Date().toISOString());
    initializeScripts(consentData);
  };

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    setConsent(allConsent);
    saveConsent(allConsent);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    setConsent(minimalConsent);
    saveConsent(minimalConsent);
    blockScripts('analytics');
    blockScripts('marketing');
    setIsVisible(false);
  };

  const handleSaveSettings = () => {
    saveConsent(consent);
    
    // Block scripts for disabled categories
    if (!consent.analytics) blockScripts('analytics');
    if (!consent.marketing) blockScripts('marketing');
    
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleToggle = (category) => {
    if (category === 'necessary') return; // Can't disable necessary
    setConsent(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm"
      data-testid="cookie-consent-overlay"
    >
      <div className="w-full max-w-2xl bg-[#0f172a] border border-[#1e3a8a] rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1e3a8a]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#06d6a0]/10">
              <Cookie className="h-6 w-6 text-[#06d6a0]" />
            </div>
            <h2 className="text-xl font-semibold text-slate-100">
              Ochrana osobních údajů
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRejectAll}
            className="text-slate-400 hover:text-slate-100"
            data-testid="cookie-consent-close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showSettings ? (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Používáme cookies pro zajištění základní funkčnosti, analýzu návštěvnosti a vylepšení vašeho zážitku. 
                Vyberte si, které kategorie cookies chcete povolit, nebo <button 
                  onClick={() => setShowSettings(true)}
                  className="text-[#06d6a0] underline hover:text-[#06d6a0]/80"
                  data-testid="cookie-consent-customize"
                >
                  upravte nastavení
                </button>.
              </p>
              <p className="text-sm text-slate-400">
                Více informací najdete v našich{' '}
                <a href="/privacy" className="text-[#06d6a0] underline hover:text-[#06d6a0]/80">
                  Zásadách ochrany osobních údajů
                </a>.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm mb-4">
                Můžete si zvolit, které kategorie cookies chcete povolit:
              </p>

              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-4 bg-[#0a0f1d] rounded-lg border border-[#1e3a8a]/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-[#06d6a0]" />
                    <h3 className="font-semibold text-slate-100">Nezbytné cookies</h3>
                  </div>
                  <p className="text-sm text-slate-400">
                    Nutné pro základní funkčnost webu (přihlášení, bezpečnost). Nelze zakázat.
                  </p>
                </div>
                <Switch 
                  checked={true} 
                  disabled
                  className="opacity-50"
                  data-testid="consent-necessary"
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 bg-[#0a0f1d] rounded-lg border border-[#1e3a8a]/50">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100 mb-1">Analytické cookies</h3>
                  <p className="text-sm text-slate-400">
                    Pomáhají nám pochopit, jak návštěvníci používají web, abychom jej mohli vylepšovat.
                  </p>
                </div>
                <Switch 
                  checked={consent.analytics}
                  onCheckedChange={() => handleToggle('analytics')}
                  data-testid="consent-analytics"
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 bg-[#0a0f1d] rounded-lg border border-[#1e3a8a]/50">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100 mb-1">Marketingové cookies</h3>
                  <p className="text-sm text-slate-400">
                    Slouží k zobrazení relevantních reklam a měření účinnosti kampaní.
                  </p>
                </div>
                <Switch 
                  checked={consent.marketing}
                  onCheckedChange={() => handleToggle('marketing')}
                  data-testid="consent-marketing"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1e3a8a] bg-[#0a0f1d]/50">
          {!showSettings ? (
            <>
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="border-[#1e3a8a] text-slate-300 hover:bg-[#1e3a8a]/20"
                data-testid="cookie-consent-reject"
              >
                Odmítnout vše
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettings(true)}
                className="border-[#1e3a8a] text-slate-300 hover:bg-[#1e3a8a]/20"
              >
                Upravit nastavení
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="bg-[#06d6a0] text-[#0a0f1d] hover:bg-[#06d6a0]/90 font-semibold"
                data-testid="cookie-consent-accept"
              >
                Přijmout vše
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="border-[#1e3a8a] text-slate-300 hover:bg-[#1e3a8a]/20"
              >
                Zpět
              </Button>
              <Button
                onClick={handleSaveSettings}
                className="bg-[#06d6a0] text-[#0a0f1d] hover:bg-[#06d6a0]/90 font-semibold"
                data-testid="cookie-consent-save"
              >
                Uložit nastavení
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;