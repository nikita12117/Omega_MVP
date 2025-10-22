import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Users, Gift, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';

export default function ReferralModal({ open, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      loadStats();
    }
  }, [open]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/referral/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading referral stats:', error);
      const message = error.response?.data?.detail || 'Nepodařilo se načíst referral statistiky';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (stats?.referral_link) {
      navigator.clipboard.writeText(stats.referral_link);
      setCopied(true);
      toast.success('Odkaz zkopírován do schránky!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f172a] border-[#1e3a8a] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-100 flex items-center gap-2 text-2xl">
            <Gift className="h-6 w-6 text-[#06d6a0]" />
            Referral Program
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#06d6a0]" />
          </div>
        ) : stats ? (
          <div className="space-y-6 mt-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0a0f1d] border border-[#1e3a8a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-[#06d6a0]" />
                  <span className="text-sm text-slate-400">Přivedení uživatelé</span>
                </div>
                <div className="text-3xl font-bold text-slate-100">
                  {stats.referral_count}
                </div>
              </div>

              <div className="bg-[#0a0f1d] border border-[#1e3a8a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-[#06d6a0]" />
                  <span className="text-sm text-slate-400">Odměny celkem</span>
                </div>
                <div className="text-3xl font-bold text-[#06d6a0]">
                  {stats.total_rewards_earned.toLocaleString()}
                </div>
                <span className="text-xs text-slate-500">tokenů</span>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            {/* Referral Link */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-100">Váš unikátní odkaz</h3>
                <Badge className="bg-[#06d6a0]/10 text-[#06d6a0] border-[#06d6a0]/30">
                  {stats.referral_code}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1 bg-[#0a0f1d] border border-[#1e3a8a] rounded-lg px-4 py-3 text-sm text-slate-300 overflow-x-auto">
                  {stats.referral_link}
                </div>
                <Button
                  onClick={handleCopyLink}
                  className="bg-[#06d6a0] text-[#0a0f1d] hover:bg-[#06d6a0]/90"
                  data-testid="copy-referral-link"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-slate-400">
                Sdílejte tento odkaz s přáteli. Za každého ověřeného uživatele získáte <strong className="text-[#06d6a0]">10,000 tokenů</strong>!
              </p>
            </div>

            <Separator className="bg-slate-800" />

            {/* Referred Users List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-100">Přivedení uživatelé</h3>
              
              {stats.referred_users.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stats.referred_users.map((user, index) => (
                    <div
                      key={index}
                      className="bg-[#0a0f1d] border border-[#1e3a8a] rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-100">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          Ověřeno: {new Date(user.verified_at).toLocaleDateString('cs-CZ')}
                        </div>
                      </div>
                      <Badge className="bg-[#06d6a0]/10 text-[#06d6a0] border-[#06d6a0]/30">
                        +{user.reward_earned.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">
                    Zatím jste nikoho nepřivedli. Začněte sdílet svůj odkaz!
                  </p>
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">📋 Jak to funguje</h4>
              <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                <li>Sdílejte svůj unikátní odkaz s přáteli</li>
                <li>Nový uživatel se přihlásí přes Google</li>
                <li>Uživatel ověří telefonní číslo</li>
                <li>Vy automaticky získáte <strong className="text-[#06d6a0]">10,000 tokenů</strong> odměnu!</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            Nepodařilo se načíst data
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}