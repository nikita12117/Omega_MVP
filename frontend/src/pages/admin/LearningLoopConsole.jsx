import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { CheckCircle, XCircle, Clock, PlayCircle } from 'lucide-react';

const LearningLoopConsole = () => {
  const [learningSummaries, setLearningSummaries] = useState([]);
  const [masterPrompts, setMasterPrompts] = useState([]);
  const [selectedPending, setSelectedPending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [diffView, setDiffView] = useState('side-by-side');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summariesRes, promptsRes] = await Promise.all([
        apiClient.get('/admin/learning-summaries'),
        apiClient.get('/admin/master-prompts')
      ]);
      
      setLearningSummaries(summariesRes.data.summaries || []);
      setMasterPrompts(promptsRes.data.master_prompts || []);
      
      const pending = promptsRes.data.master_prompts.find(p => p.status === 'pending');
      if (pending) {
        setSelectedPending(pending);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Chyba při načítání dat');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (version) => {
    setActionLoading(true);
    try {
      await apiClient.post('/admin/master-prompts/approve', { version });
      toast.success(`Master Prompt ${version} schválen a aktivován!`);
      fetchData();
      setSelectedPending(null);
    } catch (error) {
      console.error('Error approving:', error);
      toast.error('Chyba při schvalování');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (version) => {
    setActionLoading(true);
    try {
      await apiClient.post('/admin/master-prompts/reject', { version });
      toast.success(`Master Prompt ${version} zamítnut`);
      fetchData();
      setSelectedPending(null);
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('Chyba při zamítání');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTriggerLearning = async () => {
    setActionLoading(true);
    try {
      await apiClient.post('/admin/trigger-learning');
      toast.success('Learning loop spuštěn! Výsledky budou dostupné za několik minut.');
      setTimeout(fetchData, 5000);
    } catch (error) {
      console.error('Error triggering learning:', error);
      toast.error('Chyba při spouštění learning loop');
    } finally {
      setActionLoading(false);
    }
  };

  const renderDiffView = () => {
    if (!selectedPending) return null;

    const activePrompt = masterPrompts.find(p => p.status === 'active');
    if (!activePrompt) {
      return (
        <div className="text-center p-12 text-[#7a8fb8]">
          Není aktivní Master Prompt pro porovnání
        </div>
      );
    }

    const oldContent = activePrompt.content;
    const newContent = selectedPending.content;

    if (diffView === 'side-by-side') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-[#7a8fb8] mb-3">
              Aktuální ({activePrompt.version})
            </div>
            <pre className="bg-[#0f1b33] border border-[#25365a] p-6 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap text-[#9fb4d0] font-mono">
              {oldContent}
            </pre>
          </div>
          <div>
            <div className="text-sm font-medium text-[#06d6a0] mb-3">
              Navrhovaný ({selectedPending.version})
            </div>
            <pre className="bg-[#0f1b33] border-2 border-[#06d6a0]/50 p-6 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap text-[#06d6a0] font-mono">
              {newContent}
            </pre>
          </div>
        </div>
      );
    } else {
      const generateUnifiedDiff = (oldText, newText) => {
        const oldLines = oldText.split('\n');
        const newLines = newText.split('\n');
        
        let result = [];
        const maxLen = Math.max(oldLines.length, newLines.length);
        
        for (let i = 0; i < maxLen; i++) {
          const oldLine = oldLines[i] || '';
          const newLine = newLines[i] || '';
          
          if (oldLine === newLine) {
            result.push(`  ${oldLine}`);
          } else {
            if (oldLine) result.push(`- ${oldLine}`);
            if (newLine) result.push(`+ ${newLine}`);
          }
        }
        
        return result.join('\n');
      };

      return (
        <div>
          <div className="text-sm font-medium text-[#e6f1ff] mb-3">
            Unified Diff ({activePrompt.version} → {selectedPending.version})
          </div>
          <pre className="bg-[#0f1b33] border border-[#25365a] p-6 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap text-[#9fb4d0] font-mono">
            {generateUnifiedDiff(oldContent, newContent)}
          </pre>
        </div>
      );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06d6a0]"></div>
      </div>
    );
  }

  const pendingPrompts = masterPrompts.filter(p => p.status === 'pending');
  const recentSummaries = learningSummaries.slice(0, 10);

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 px-2">
          <div>
            <h2 className="text-4xl font-bold text-[#e6f1ff] mb-3">Learning Loop Console</h2>
            <p className="text-lg text-[#9fb4d0]">
              Nightly AI meta-učení | Schvalování evolucí Master Promptu
            </p>
          </div>
          <Button 
            onClick={handleTriggerLearning} 
            disabled={actionLoading}
            className="bg-[#06d6a0] hover:bg-[#07f0b8] text-[#0a0f1d] font-semibold h-12 px-6"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Spustit Learning Loop
          </Button>
        </div>

        {/* Pending Approvals */}
        {pendingPrompts.length > 0 && (
          <Card className="border-[#f59e0b]/50 bg-[#10172a]">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-[#f59e0b] text-2xl">
                <Clock className="w-6 h-6 mr-3" />
                Čekající schválení ({pendingPrompts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingPrompts.map(prompt => (
                  <div 
                    key={prompt.version}
                    className={`p-5 rounded border cursor-pointer transition-all ${
                      selectedPending?.version === prompt.version 
                        ? 'border-[#06d6a0] bg-[#0f1b33]' 
                        : 'border-[#25365a] hover:border-[#06d6a0]/50'
                    }`}
                    onClick={() => setSelectedPending(prompt)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-lg text-[#e6f1ff]">{prompt.version}</span>
                        <span className="text-sm text-[#9fb4d0] ml-4">
                          {new Date(prompt.created_at).toLocaleString('cs-CZ')}
                        </span>
                      </div>
                      {selectedPending?.version === prompt.version && (
                        <div className="flex gap-3">
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(prompt.version);
                            }}
                            disabled={actionLoading}
                            className="bg-[#06d6a0] hover:bg-[#07f0b8] text-[#0a0f1d] font-semibold h-10 px-5"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Schválit
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(prompt.version);
                            }}
                            disabled={actionLoading}
                            className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold h-10 px-5"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Zamítnout
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diff Viewer */}
        {selectedPending && (
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-[#e6f1ff]">Porovnání verzí</CardTitle>
                <div className="flex gap-3">
                  <Button
                    variant={diffView === 'side-by-side' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDiffView('side-by-side')}
                    className={diffView === 'side-by-side' ? 'bg-[#06d6a0] text-[#0a0f1d]' : 'border-[#25365a] text-[#9fb4d0]'}
                  >
                    Side-by-Side
                  </Button>
                  <Button
                    variant={diffView === 'unified' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDiffView('unified')}
                    className={diffView === 'unified' ? 'bg-[#06d6a0] text-[#0a0f1d]' : 'border-[#25365a] text-[#9fb4d0]'}
                  >
                    Unified
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderDiffView()}
              
              {selectedPending.patterns_learned && selectedPending.patterns_learned.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold text-[#e6f1ff] mb-3">Naučené vzory:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPending.patterns_learned.map((pattern, idx) => (
                      <Badge key={idx} className="bg-[#1e3a8a] text-[#e6f1ff] px-3 py-1">{pattern}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Learning Summaries */}
        <Card className="bg-[#10172a] border-[#25365a]">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-[#e6f1ff]">Poslední Learning Summaries</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSummaries.length === 0 ? (
              <div className="text-center p-12 text-[#7a8fb8] text-lg">
                Zatím žádné learning summaries
              </div>
            ) : (
              <div className="space-y-6">
                {recentSummaries.map(summary => (
                  <div key={summary.date} className="border border-[#25365a] rounded p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg text-[#e6f1ff]">{summary.date}</h4>
                      <Badge className={summary.approved ? 'bg-[#06d6a0] text-[#0a0f1d]' : 'bg-[#7a8fb8] text-[#0a0f1d]'}>
                        {summary.approved ? 'Schváleno' : 'Čeká'}
                      </Badge>
                    </div>
                    <p className="text-base text-[#9fb4d0] mb-4">{summary.summary_text}</p>
                    
                    {summary.patterns_extracted && summary.patterns_extracted.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-[#7a8fb8] mb-2">Extrahované vzory:</div>
                        <div className="flex flex-wrap gap-2">
                          {summary.patterns_extracted.map((pattern, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-[#25365a] text-[#9fb4d0]">
                              {pattern}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {summary.tokens_used && (
                      <div className="mt-3 text-xs text-[#7a8fb8]">
                        Tokeny použité: {summary.tokens_used.total.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Master Prompts History */}
        <Card className="bg-[#10172a] border-[#25365a]">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-[#e6f1ff]">Historie Master Promptů</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {masterPrompts.map(prompt => (
                <div 
                  key={prompt.version} 
                  className="flex items-center justify-between p-5 border border-[#25365a] rounded hover:bg-[#0f1b33] transition"
                >
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusBadge(prompt.status)}>
                      {prompt.status}
                    </Badge>
                    <span className="font-semibold text-[#e6f1ff]">{prompt.version}</span>
                    <span className="text-sm text-[#9fb4d0]">
                      {new Date(prompt.created_at).toLocaleString('cs-CZ')}
                    </span>
                  </div>
                  {prompt.approved_by && (
                    <span className="text-xs text-[#7a8fb8]">
                      Schválil: {prompt.approved_by}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningLoopConsole;