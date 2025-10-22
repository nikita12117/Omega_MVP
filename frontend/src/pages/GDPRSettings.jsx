import React, { useState, useEffect } from 'react';
import { Shield, Download, Trash2, RefreshCw, Cookie, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const GDPRSettings = () => {
  const [consent, setConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Load current consent settings
    const savedConsent = localStorage.getItem('gdpr_consent');
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent));
    }
  }, []);

  const handleToggle = (category) => {
    if (category === 'necessary') return; // Can't disable necessary
    
    const newConsent = {
      ...consent,
      [category]: !consent[category]
    };
    
    setConsent(newConsent);
    localStorage.setItem('gdpr_consent', JSON.stringify(newConsent));
    localStorage.setItem('gdpr_consent_date', new Date().toISOString());
    
    // Trigger consent events
    if (window.dataLayer) {
      if (newConsent[category]) {
        window.dataLayer.push({ event: `consent_granted_${category}` });
      } else {
        window.dataLayer.push({ event: `consent_revoked_${category}` });
      }
    }
    
    toast.success(`Nastavení ${category === 'analytics' ? 'analytických' : 'marketingových'} cookies bylo aktualizováno`);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/gdpr/export`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Vaše data byla úspěšně stažena');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Chyba při exportu dat. Zkuste to prosím znovu.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/gdpr/delete`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Deletion failed');
      }

      toast.success('Váš účet byl smazán. Budete přesměrováni...');
      
      // Clear local storage and redirect
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Chyba při mazání účtu. Zkuste to prosím znovu.');
      setIsDeleting(false);
    }
  };

  const handleResetConsent = () => {
    const resetConsent = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    setConsent(resetConsent);
    localStorage.removeItem('gdpr_consent');
    localStorage.removeItem('gdpr_consent_date');
    
    // Revoke all consent
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'consent_revoked_analytics' });
      window.dataLayer.push({ event: 'consent_revoked_marketing' });
    }
    
    toast.success('Nastavení cookies bylo resetováno');
  };

  const consentDate = localStorage.getItem('gdpr_consent_date');

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#06d6a0]/10 rounded-full">
              <Shield className="h-8 w-8 text-[#06d6a0]" />
            </div>
            <h1 className="text-4xl font-bold text-slate-100">GDPR nastavení</h1>
          </div>
          <p className="text-slate-400">
            Spravujte své soukromí a práva dle GDPR (nařízení EU 2016/679)
          </p>
        </div>

        {/* Cookie Consent Settings */}
        <div className="bg-[#0f172a] border border-[#1e3a8a] rounded-lg p-6 mb-6" data-testid="cookie-settings-section">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="h-6 w-6 text-[#06d6a0]" />
            <h2 className="text-2xl font-semibold text-slate-100">Nastavení cookies</h2>
          </div>
          
          {consentDate && (
            <p className="text-sm text-slate-400 mb-4">
              Poslední aktualizace: {new Date(consentDate).toLocaleString('cs-CZ')}
            </p>
          )}

          <div className="space-y-4">
            {/* Necessary */}
            <div className="flex items-start justify-between p-4 bg-[#0a0f1d] rounded-lg border border-[#1e3a8a]/50">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100 mb-1">Nezbytné cookies</h3>
                <p className="text-sm text-slate-400">
                  Nutné pro základní funkčnost (přihlášení, bezpečnost). Nelze zakázat.
                </p>
              </div>
              <Switch 
                checked={true} 
                disabled
                className="opacity-50"
                data-testid="consent-necessary-switch"
              />
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between p-4 bg-[#0a0f1d] rounded-lg border border-[#1e3a8a]/50">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100 mb-1">Analytické cookies</h3>
                <p className="text-sm text-slate-400">
                  Pomáhají nám pochopit, jak používáte web.
                </p>
              </div>
              <Switch 
                checked={consent.analytics}
                onCheckedChange={() => handleToggle('analytics')}
                data-testid="consent-analytics-switch"
              />
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between p-4 bg-[#0a0f1d] rounded-lg border border-[#1e3a8a]/50">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100 mb-1">Marketingové cookies</h3>
                <p className="text-sm text-slate-400">
                  Pro zobrazení relevantních reklam.
                </p>
              </div>
              <Switch 
                checked={consent.marketing}
                onCheckedChange={() => handleToggle('marketing')}
                data-testid="consent-marketing-switch"
              />
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleResetConsent}
              className="border-[#1e3a8a] text-slate-300 hover:bg-[#1e3a8a]/20"
              data-testid="reset-consent-button"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetovat nastavení
            </Button>
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-[#0f172a] border border-[#1e3a8a] rounded-lg p-6 mb-6" data-testid="data-export-section">
          <div className="flex items-center gap-3 mb-4">
            <Download className="h-6 w-6 text-[#06d6a0]" />
            <h2 className="text-2xl font-semibold text-slate-100">Export osobních údajů</h2>
          </div>
          
          <p className="text-slate-300 mb-4">
            Stáhněte si kopii všech svých osobních údajů ve formátu JSON. Zahrnuje profil, transakce a historii agentů.
          </p>
          
          <Alert className="mb-4 bg-[#06d6a0]/10 border-[#06d6a0]/30">
            <AlertDescription className="text-slate-300">
              <strong>Právo na přístup (Čl. 15 GDPR):</strong> Máte právo získat kopii všech osobních údajů, které o vás zpracováváme.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleExportData}
            disabled={isExporting}
            className="bg-[#06d6a0] text-[#0a0f1d] hover:bg-[#06d6a0]/90"
            data-testid="export-data-button"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Exportuji...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Stáhnout moje data
              </>
            )}
          </Button>
        </div>

        {/* Account Deletion */}
        <div className="bg-[#0f172a] border border-red-600/50 rounded-lg p-6" data-testid="data-deletion-section">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-semibold text-slate-100">Smazání účtu a dat</h2>
          </div>
          
          <p className="text-slate-300 mb-4">
            Trvale smazat váš účet a všechna související data. <strong className="text-red-400">Tato akce je nevratná!</strong>
          </p>
          
          <Alert className="mb-4 bg-red-900/20 border-red-600/30">
            <AlertDescription className="text-slate-300">
              <strong>Právo na výmaz (Čl. 17 GDPR):</strong> Máte právo požádat o vymazání svých osobních údajů ("právo být zapomenut"). 
              Některá data mohou být ponechána z právních důvodů (např. účetní doklady po dobu 7 let).
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
            data-testid="delete-account-button"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Smazat můj účet
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-[#0f172a] border border-[#1e3a8a] rounded-lg">
          <p className="text-slate-400 text-sm">
            Máte dotazy ohledně ochrany osobních údajů? Kontaktujte nás na{' '}
            <a href="mailto:privacy@quantum-codex.com" className="text-[#06d6a0] hover:underline">
              privacy@quantum-codex.com
            </a>
            {' '}nebo si přečtěte naše{' '}
            <a href="/privacy" className="text-[#06d6a0] hover:underline">
              Zásady ochrany osobních údajů
            </a>.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#0f172a] border-red-600/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100">
              Opravdu chcete smazat svůj účet?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Tato akce je <strong className="text-red-400">nevratná</strong>. Všechny vaše údaje, včetně:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Profilu a přihlašovacích údajů</li>
                <li>Historie vygenerovaných agentů</li>
                <li>Zůstatku tokenů</li>
                <li>Transakční historie (kromě účetních dokladů)</li>
              </ul>
              <p className="mt-3">
                budou trvale smazány. Účetní doklady budou uchovány po dobu 7 let dle zákona.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#1e3a8a] text-slate-300">
              Zrušit
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
              data-testid="confirm-delete-button"
            >
              {isDeleting ? 'Mažu...' : 'Ano, smazat účet'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GDPRSettings;