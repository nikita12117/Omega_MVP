import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { QrCode, Plus, CheckCircle, XCircle, Copy, Download, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const QRManagement = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [eventName, setEventName] = useState('Default Event');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    max_activations: '',
    notes: ''
  });

  useEffect(() => {
    fetchCurrentEvent();
    fetchTokens();
  }, []);

  const fetchCurrentEvent = async () => {
    try {
      const response = await apiClient.get('/current-event');
      setEventName(response.data.event_name);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      await apiClient.post('/admin/set-event', { event_name: eventName });
      toast.success('Název eventu aktualizován!');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Chyba při aktualizaci eventu');
    }
  };

  const handleQuickCreate = async () => {
    setIsCreatingTicket(true);
    try {
      const response = await apiClient.post('/admin/quick-ticket');
      toast.success(`Ticket vytvořen: ${response.data.label}`);
      setSelectedToken(response.data);
      setShowQRModal(true);
      fetchTokens();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Chyba při vytváření ticketu');
    } finally {
      setIsCreatingTicket(false);
    }
  };

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

  const handleShowQR = (token) => {
    setSelectedToken(token);
    setShowQRModal(true);
  };

  const downloadQR = () => {
    if (!selectedToken) return;
    
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${selectedToken.label.replace(/\s+/g, '-')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success('QR kód stažen!');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8">
        {/* Header with Event Name */}
        <Card className="bg-[#10172a] border-[#25365a]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#e6f1ff] flex items-center gap-2">
              <QrCode className="h-6 w-6 text-[#06d6a0]" />
              QR Ticket Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Event Name Input */}
            <div>
              <Label htmlFor="event-name" className="text-base text-[#e6f1ff] mb-2 block">
                Current Event Name
              </Label>
              <div className="flex gap-3">
                <Input
                  id="event-name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g., Web Summit 2025"
                  className="flex-1 bg-[#0f1b33] border-[#25365a] text-[#e6f1ff] placeholder:text-[#7a8fb8]"
                />
                <Button
                  onClick={handleUpdateEvent}
                  variant="outline"
                  className="border-[#25365a] text-[#e6f1ff] hover:bg-[#25365a]"
                >
                  Update
                </Button>
              </div>
              <p className="text-sm text-[#9fb4d0] mt-2">
                All tickets will use this event name. Change it when switching events.
              </p>
            </div>

            {/* Quick Create Button */}
            <Button
              onClick={handleQuickCreate}
              disabled={isCreatingTicket}
              className="w-full bg-[#06d6a0] hover:bg-[#07f0b8] text-[#0a0f1d] font-semibold h-14 text-lg"
            >
              {isCreatingTicket ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0a0f1d] mr-2"></div>
                  Creating Ticket...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-6 w-6" />
                  Create New Ticket (One Click)
                </>
              )}
            </Button>

            {/* Advanced Create (Optional) */}
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full border-[#25365a] text-[#9fb4d0] hover:text-[#e6f1ff] hover:border-[#06d6a0]/50"
            >
              {showCreateForm ? 'Hide' : 'Show'} Advanced Options
            </Button>
          </CardContent>
        </Card>

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
              <div className="space-y-4">
                {tokens.map(token => (
                  <div 
                    key={token.id}
                    className="border border-[#25365a] rounded-lg p-4 md:p-6 hover:bg-[#0f1b33] transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {/* Large Clickable QR Icon - Left Side */}
                      <button
                        onClick={() => handleShowQR(token)}
                        className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-[#06d6a0]/10 hover:bg-[#06d6a0]/20 border-2 border-[#06d6a0] rounded-lg flex items-center justify-center transition-all cursor-pointer group"
                        title="Klikněte pro zobrazení QR kódu"
                      >
                        <QrCode className="w-12 h-12 sm:w-14 sm:h-14 text-[#06d6a0] group-hover:scale-110 transition-transform" />
                      </button>

                      {/* Token Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <h3 className="font-semibold text-lg sm:text-xl text-[#e6f1ff] truncate">{token.label}</h3>
                          <Badge className={getStatusBadge(token.status)}>
                            {token.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm sm:text-base text-[#9fb4d0] space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-medium">Token:</span>
                            <code className="bg-[#0f1b33] px-2 py-1 rounded text-xs sm:text-sm text-[#06d6a0] break-all">
                              {token.token}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="self-start sm:self-auto h-7 px-2 text-[#9fb4d0] hover:text-[#e6f1ff]"
                              onClick={() => copyToClipboard(token.token)}
                            >
                              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
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
                          {token.notes && (
                            <div className="mt-2 p-2 bg-[#0f1b33] rounded text-sm">
                              <span className="font-medium">Poznámky:</span> {token.notes}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button
                            onClick={() => handleShowQR(token)}
                            className="bg-[#06d6a0] hover:bg-[#07f0b8] text-[#0a0f1d] font-semibold h-9 px-4 text-sm"
                          >
                            <QrCode className="w-4 h-4 mr-2" />
                            Zobrazit QR
                          </Button>
                          {token.status === 'active' ? (
                            <Button
                              onClick={() => handleStatusChange(token.id, 'disabled')}
                              variant="outline"
                              className="border-[#7a8fb8] text-[#7a8fb8] hover:border-[#ef4444] hover:text-[#ef4444] h-9 px-4 text-sm"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Deaktivovat
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleStatusChange(token.id, 'active')}
                              variant="outline"
                              className="border-[#06d6a0] text-[#06d6a0] hover:bg-[#06d6a0]/10 h-9 px-4 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Aktivovat
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code Modal */}
        <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
          <DialogContent className="bg-[#10172a] border-[#25365a] text-[#e6f1ff] max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <QrCode className="h-6 w-6 text-[#06d6a0]" />
                {selectedToken?.label}
              </DialogTitle>
            </DialogHeader>
            
            {selectedToken && (
              <div className="space-y-6">
                {/* QR Code */}
                <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={`${window.location.origin}/demo/activate/${selectedToken.token}`}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                {/* Token Info */}
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#9fb4d0]">Status:</span>{' '}
                    <Badge className={getStatusBadge(selectedToken.status)}>
                      {selectedToken.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-[#9fb4d0]">Aktivace:</span>{' '}
                    <span className="text-[#e6f1ff]">
                      {selectedToken.activations_count}
                      {selectedToken.max_activations && ` / ${selectedToken.max_activations}`}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="text-[#9fb4d0] mb-1">Aktivační URL:</div>
                    <code className="block bg-[#0f1b33] p-2 rounded text-xs text-[#06d6a0] break-all">
                      {window.location.origin}/demo/activate/{selectedToken.token}
                    </code>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={downloadQR}
                    className="flex-1 bg-[#06d6a0] hover:bg-[#07f0b8] text-[#0a0f1d] font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Stáhnout QR
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(selectedToken.token)}
                    variant="outline"
                    className="flex-1 border-[#25365a] text-[#e6f1ff] hover:bg-[#25365a]"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Kopírovat URL
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QRManagement;