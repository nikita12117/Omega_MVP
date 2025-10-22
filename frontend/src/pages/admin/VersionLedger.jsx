import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { GitCommit, CheckCircle, XCircle, Archive, Eye } from 'lucide-react';

const VersionLedger = () => {
  const [masterPrompts, setMasterPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  useEffect(() => {
    fetchMasterPrompts();
  }, []);

  const fetchMasterPrompts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/master-prompts');
      setMasterPrompts(response.data.master_prompts || []);
    } catch (error) {
      console.error('Error fetching master prompts:', error);
      toast.error('Chyba při načítání verzí');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-[#06d6a0]" />;
      case 'pending':
        return <GitCommit className="w-5 h-5 text-[#f59e0b]" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-[#ef4444]" />;
      case 'archived':
        return <Archive className="w-5 h-5 text-[#7a8fb8]" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-[#06d6a0] text-[#0a0f1d]',
      pending: 'bg-[#f59e0b] text-[#0a0f1d]',
      rejected: 'bg-[#ef4444] text-white',
      archived: 'bg-[#7a8fb8] text-[#0a0f1d]'
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
        <div className="mb-12 px-2">
          <h2 className="text-4xl font-bold text-[#e6f1ff] mb-3">Version Ledger</h2>
          <p className="text-lg text-[#9fb4d0]">
            Kompletní changelog Master Prompt evoluce
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-[#e6f1ff] mb-2">
                {masterPrompts.length}
              </div>
              <div className="text-sm text-[#9fb4d0]">Celkem Verzí</div>
            </CardContent>
          </Card>
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-[#06d6a0] mb-2">
                {masterPrompts.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-[#9fb4d0]">Aktivní</div>
            </CardContent>
          </Card>
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-[#f59e0b] mb-2">
                {masterPrompts.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-sm text-[#9fb4d0]">Čekající</div>
            </CardContent>
          </Card>
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-[#7a8fb8] mb-2">
                {masterPrompts.filter(p => p.status === 'archived').length}
              </div>
              <div className="text-sm text-[#9fb4d0]">Archivované</div>
            </CardContent>
          </Card>
        </div>

        {/* Version History Timeline */}
        <Card className="bg-[#10172a] border-[#25365a]">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-[#e6f1ff]">Historie Verzí</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {masterPrompts.map((prompt, idx) => (
                <div 
                  key={prompt.version}
                  className="flex gap-6 pb-6 border-b border-[#25365a] last:border-b-0"
                >
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-2 border-[#25365a] flex items-center justify-center bg-[#10172a]">
                      {getStatusIcon(prompt.status)}
                    </div>
                    {idx < masterPrompts.length - 1 && (
                      <div className="w-0.5 flex-1 bg-[#25365a] my-3"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-xl text-[#e6f1ff]">{prompt.version}</h4>
                          <Badge className={getStatusBadge(prompt.status)}>
                            {prompt.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#9fb4d0] mb-1">
                          Vytvořeno: {formatDate(prompt.created_at)}
                        </p>
                        {prompt.approved_at && (
                          <p className="text-sm text-[#9fb4d0]">
                            Schváleno: {formatDate(prompt.approved_at)}
                            {prompt.approved_by && ` • ${prompt.approved_by}`}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPrompt(prompt)}
                        className="border-[#25365a] text-[#9fb4d0] hover:text-[#e6f1ff] hover:border-[#06d6a0]/50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                    </div>

                    {/* Patterns Learned */}
                    {prompt.patterns_learned && prompt.patterns_learned.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-[#7a8fb8] mb-2">
                          Naučené vzory:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {prompt.patterns_learned.map((pattern, pidx) => (
                            <Badge key={pidx} variant="outline" className="text-xs border-[#25365a] text-[#9fb4d0]">
                              {pattern}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {selectedPrompt && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50 backdrop-blur-sm"
          onClick={() => setSelectedPrompt(null)}
        >
          <Card 
            className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-[#10172a] border-[#25365a]"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b border-[#25365a] pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-2xl text-[#e6f1ff]">{selectedPrompt.version}</CardTitle>
                  <Badge className={getStatusBadge(selectedPrompt.status)}>
                    {selectedPrompt.status}
                  </Badge>
                </div>
                <Button variant="ghost" onClick={() => setSelectedPrompt(null)} className="text-[#9fb4d0] hover:text-[#e6f1ff]">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <label className="text-sm font-medium text-[#7a8fb8] block mb-2">Vytvořeno</label>
                <p className="text-base text-[#e6f1ff]">{formatDate(selectedPrompt.created_at)}</p>
              </div>

              {selectedPrompt.approved_at && (
                <div>
                  <label className="text-sm font-medium text-[#7a8fb8] block mb-2">Schváleno</label>
                  <p className="text-base text-[#e6f1ff]">
                    {formatDate(selectedPrompt.approved_at)}
                    {selectedPrompt.approved_by && ` • ${selectedPrompt.approved_by}`}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-[#7a8fb8] mb-3 block">
                  Master Prompt Content
                </label>
                <pre className="bg-[#0f1b33] border border-[#25365a] p-6 rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap text-[#9fb4d0] font-mono">
                  {selectedPrompt.content}
                </pre>
              </div>

              {selectedPrompt.patterns_learned && selectedPrompt.patterns_learned.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-[#7a8fb8] mb-3 block">
                    Naučené Vzory
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrompt.patterns_learned.map((pattern, idx) => (
                      <Badge key={idx} className="bg-[#1e3a8a] text-[#e6f1ff]">{pattern}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VersionLedger;