import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PhoneVerificationModal({ open, onClose, onVerified, userData }) {
  const [step, setStep] = useState(1); // 1 = phone input, 2 = code input
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockCode, setMockCode] = useState(null);

  const handleRequestCode = async () => {
    if (!phoneNumber || !phoneNumber.startsWith('+420')) {
      toast.error('Zadejte platné české telefonní číslo (+420XXXXXXXXX)');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/phone/request-verification`, {
        phone_number: phoneNumber
      });

      if (response.data.mock_code) {
        setMockCode(response.data.mock_code);
      }

      toast.success('Ověřovací kód byl odeslán');
      setStep(2);
    } catch (error) {
      console.error('Request verification error:', error);
      const message = error.response?.data?.detail || 'Chyba při odesílání kódu';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Zadejte 6místný ověřovací kód');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/phone/verify`, {
        phone_number: phoneNumber,
        verification_code: verificationCode
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Telefon byl úspěšně ověřen! Generator je nyní odemčen!');
      
      // Update user data in localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      if (response.data.omega_tokens_balance !== undefined) {
        localStorage.setItem('omega_tokens', response.data.omega_tokens_balance);
      }

      onVerified(response.data);
      onClose();
    } catch (error) {
      console.error('Verify code error:', error);
      const message = error.response?.data?.detail || 'Neplatný ověřovací kód';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f172a] border-[#1e3a8a] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-100 flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#06d6a0]" />
            Ověření telefonního čísla
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {step === 1 
              ? 'Zadejte své české telefonní číslo pro dokončení registrace'
              : 'Zadejte 6místný kód, který vám byl odeslán SMS'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Telefonní číslo</label>
                <Input
                  type="tel"
                  placeholder="+420123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-[#0a0f1d] border-slate-700 text-slate-100"
                  data-testid="phone-input"
                />
                <p className="text-xs text-slate-400">
                  Formát: +420 následované 9 číslicemi
                </p>
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/30">
                <AlertDescription className="text-slate-300 text-sm">
                  <strong className="text-blue-400">Proč ověřujeme telefon?</strong><br/>
                  Telefonní číslo zajišťuje unikátnost účtu a umožňuje účast v referral programu.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleRequestCode}
                disabled={loading || !phoneNumber}
                className="w-full bg-[#06d6a0] text-[#0a0f1d] hover:bg-[#06d6a0]/90"
                data-testid="request-code-button"
              >
                {loading ? 'Odesílám...' : 'Odeslat ověřovací kód'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Ověřovací kód</label>
                <Input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="bg-[#0a0f1d] border-slate-700 text-slate-100 text-center text-2xl tracking-widest"
                  data-testid="code-input"
                />
                <p className="text-xs text-slate-400">
                  Kód odeslán na: {phoneNumber}
                </p>
              </div>

              {mockCode && (
                <Alert className="bg-orange-500/10 border-orange-500/30">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  <AlertDescription className="text-slate-300 text-sm ml-2">
                    <strong>MVP Mode:</strong> Váš kód je <strong className="text-orange-400">{mockCode}</strong>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 border-slate-700 text-slate-300"
                >
                  Zpět
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 bg-[#06d6a0] text-[#0a0f1d] hover:bg-[#06d6a0]/90"
                  data-testid="verify-code-button"
                >
                  {loading ? 'Ověřuji...' : 'Ověřit'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}