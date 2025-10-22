import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { QrCode, Plus, CheckCircle, XCircle, Copy } from 'lucide-react';

const QRManagement = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    max_activations: '',
    notes: ''
  });

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/qr-tokens');
      setTokens(response.data.tokens || []);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast.error('Chyba při načítání QR tokenů');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        label: formData.label,
        max_activations: formData.max_activations ? parseInt(formData.max_activations) : null,
        notes: formData.notes || null
      };
      
      await apiClient.post('/admin/qr-tokens', payload);
      toast.success('QR token vytvořen!');
      setShowCreateForm(false);
      setFormData({ label: '', max_activations: '', notes: '' });
      fetchTokens();
    } catch (error) {
      console.error('Error creating token:', error);
      toast.error('Chyba při vytváření tokenu');
    }
  };

  const handleStatusChange = async (tokenId, newStatus) => {
    try {
      await apiClient.put(`/admin/qr-tokens/${tokenId}`, { status: newStatus });
      toast.success('Status změněn');
      fetchTokens();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Chyba při změně statusu');
    }
  };

  const copyToClipboard = (token) => {
    const url = `${window.location.origin}/demo/activate/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('URL zkopírována!');
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-[#06d6a0] text-[#0a0f1d]',
      disabled: 'bg-[#7a8fb8] text-[#0a0f1d]',
      expired: 'bg-[#ef4444] text-white'
    };
    return styles[status] || 'bg-[#7a8fb8] text-[#0a0f1d]';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('cs-CZ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06d6a0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 px-2">
          <div>
            <h2 className="text-4xl font-bold text-[#e6f1ff] mb-3">QR Token Management</h2>
            <p className="text-lg text-[#9fb4d0]">
              Správa demo aktivačních tokenů pro QR kódy
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#06d6a0] hover:bg-[#07f0b8] text-[#0a0f1d] font-semibold h-12 px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nový Token
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="border-[#25365a] bg-[#10172a]">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-[#e6f1ff]">Vytvořit Nový QR Token</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <Label htmlFor="label" className="text-base text-[#e6f1ff] mb-2 block">Label / Název *</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="např. 'Prague Conference 2025'"
                    required
                    className="bg-[#0f1b33] border-[#25365a] text-[#e6f1ff] placeholder:text-[#7a8fb8] h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="max_activations" className="text-base text-[#e6f1ff] mb-2 block">Max. Aktivace (volitelné)</Label>
                  <Input
                    id="max_activations"
                    type="number"
                    value={formData.max_activations}
                    onChange={(e) => setFormData({ ...formData, max_activations: e.target.value })}
                    placeholder="Prázdné = neomezeno"
                    className="bg-[#0f1b33] border-[#25365a] text-[#e6f1ff] placeholder:text-[#7a8fb8] h-12"
                  />
                  <p className="text-sm text-[#7a8fb8] mt-2">
                    Ponechte prázdné pro neomezený počet aktivací
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-base text-[#e6f1ff] mb-2 block">Poznámky (volitelné)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Interní poznámky o tomto tokenu..."
                    rows={3}
                    className="bg-[#0f1b33] border-[#25365a] text-[#e6f1ff] placeholder:text-[#7a8fb8]"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-[#06d6a0] hover:bg-[#07f0b8] text-[#0a0f1d] font-semibold h-12 px-6">
                    Vytvořit Token
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormData({ label: '', max_activations: '', notes: '' });
                    }}
                    className="border-[#25365a] text-[#9fb4d0] hover:text-[#e6f1ff] hover:border-[#06d6a0]/50 h-12 px-6"
                  >
                    Zrušit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-[#e6f1ff] mb-2">{tokens.length}</div>
              <div className="text-sm text-[#9fb4d0]">Celkem Tokenů</div>
            </CardContent>
          </Card>
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-[#06d6a0] mb-2">
                {tokens.filter(t => t.status === 'active').length}
              </div>
              <div className="text-sm text-[#9fb4d0]">Aktivní</div>
            </CardContent>
          </Card>
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-[#7a8fb8] mb-2">
                {tokens.filter(t => t.status === 'disabled').length}
              </div>
              <div className="text-sm text-[#9fb4d0]">Deaktivované</div>
            </CardContent>
          </Card>
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-[#1e3a8a] mb-2">
                {tokens.reduce((sum, t) => sum + t.activations_count, 0)}
              </div>
              <div className="text-sm text-[#9fb4d0]">Celkem Aktivací</div>
            </CardContent>
          </Card>
        </div>

        {/* Tokens List */}
        <Card className="bg-[#10172a] border-[#25365a]">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-[#e6f1ff]">QR Tokeny ({tokens.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {tokens.length === 0 ? (
              <div className="text-center p-12 text-[#7a8fb8] text-lg">
                Žádné QR tokeny. Vytvořte první!
              </div>
            ) : (
              <div className="space-y-6">
                {tokens.map(token => (
                  <div 
                    key={token.id}
                    className="border border-[#25365a] rounded-lg p-6 hover:bg-[#0f1b33] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <QrCode className="w-6 h-6 text-[#9fb4d0]" />
                          <h3 className="font-semibold text-xl text-[#e6f1ff]">{token.label}</h3>
                          <Badge className={getStatusBadge(token.status)}>
                            {token.status}
                          </Badge>
                        </div>
                        <div className="text-base text-[#9fb4d0] space-y-1 ml-9">
                          <div>
                            <span className="font-medium">Token:</span>{' '}
                            <code className="bg-[#0f1b33] px-3 py-1 rounded text-sm text-[#06d6a0]">
                              {token.token}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-8 px-3 text-[#9fb4d0] hover:text-[#e6f1ff]"
                              onClick={() => copyToClipboard(token.token)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div>
                            <span className="font-medium">Aktivace:</span>{' '}
                            {token.activations_count}
                            {token.max_activations && ` / ${token.max_activations}`}
                          </div>
                          <div>
                            <span className="font-medium">Vytvořeno:</span>{' '}
                            {formatDate(token.created_at)}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {token.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(token.id, 'disabled')}
                            className="border-[#25365a] text-[#ef4444] hover:text-white hover:bg-[#ef4444] hover:border-[#ef4444]"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Deaktivovat
                          </Button>
                        )}
                        {token.status === 'disabled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(token.id, 'active')}
                            className="border-[#25365a] text-[#06d6a0] hover:text-[#0a0f1d] hover:bg-[#06d6a0] hover:border-[#06d6a0]"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aktivovat
                          </Button>
                        )}
                      </div>
                    </div>

                    {token.notes && (
                      <div className="mt-4 p-4 bg-[#0f1b33] border border-[#25365a] rounded text-base text-[#9fb4d0]">
                        <span className="font-medium text-[#e6f1ff]">Poznámky:</span> {token.notes}
                      </div>
                    )}

                    {token.max_activations && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-[#9fb4d0] mb-2">
                          <span>Využití</span>
                          <span>
                            {((token.activations_count / token.max_activations) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-[#0f1b33] rounded-full h-3 border border-[#25365a]">
                          <div
                            className="bg-[#06d6a0] h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min((token.activations_count / token.max_activations) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-4 bg-[#1e3a8a]/10 border border-[#1e3a8a]/30 rounded text-sm">
                      <div className="font-medium text-[#e6f1ff] mb-2">Aktivační URL:</div>
                      <code className="text-[#06d6a0] break-all text-sm">
                        {window.location.origin}/demo/activate/{token.token}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRManagement;