import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Copy, 
  Download, 
  Calendar,
  User,
  Loader2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import apiClient from '@/lib/axios';
import OmegaLogo from '@/components/OmegaLogo';

const SharedAgent = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingV9, setViewingV9] = useState(false);

  useEffect(() => {
    loadSharedAgent();
  }, [shareToken]);

  const loadSharedAgent = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/shared/${shareToken}`);
      setAgent(response.data);
      // Default to v9 if available
      setViewingV9(response.data.has_v9);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading shared agent:', error);
      // Redirect to agent creator after a brief moment
      toast.error('Sdílený agent nebyl nalezen. Přesměrování...');
      setTimeout(() => {
        navigate('/demo');
      }, 2000);
    }
  };

  const handleCopy = () => {
    const prompt = viewingV9 && agent?.v9_prompt
      ? agent.v9_prompt
      : agent?.generated_prompt;
    
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt zkopírován!');
  };

  const handleDownload = () => {
    const prompt = viewingV9 && agent?.v9_prompt
      ? agent.v9_prompt
      : agent?.generated_prompt;
    
    const filename = viewingV9 ? `${agent.agent_name}-v9.md` : `${agent.agent_name}.md`;
    const blob = new Blob([prompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Prompt stažen!');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <OmegaLogo size={60} />
          <Loader2 className="h-8 w-8 animate-spin text-[#06d6a0]" />
          <p className="text-[#9fb4d0]">Načítám sdíleného agenta...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <OmegaLogo size={60} />
          <Loader2 className="h-8 w-8 animate-spin text-[#06d6a0]" />
          <p className="text-[#9fb4d0]">Přesměrovávám na vytvoření agenta...</p>
        </div>
      </div>
    );
  }

  const currentPrompt = viewingV9 && agent?.v9_prompt ? agent.v9_prompt : agent?.generated_prompt;

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#e6f1ff]">
      {/* Header */}
      <div className="border-b border-[#25365a]/50 bg-[#10172a]/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <OmegaLogo size={40} />
            <div>
              <h1 className="text-3xl font-semibold">{agent.agent_name}</h1>
              <p className="text-[#9fb4d0] text-sm mt-1">Sdílený Omega Agent</p>
            </div>
            {agent.has_v9 && (
              <Badge className="bg-[#06d6a0]/10 text-[#06d6a0] border-[#06d6a0]/30 ml-auto">
                v-9 dostupný
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-[#9fb4d0]">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{agent.creator_email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Vytvořeno {formatDate(agent.created_at)}</span>
            </div>
          </div>

          {/* Description */}
          {agent.short_description && (
            <p className="mt-4 text-[#9fb4d0]">
              {agent.short_description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Card className="bg-[#10172a] border-[#25365a]">
          {/* Version Toggle */}
          {agent.has_v9 && (
            <div className="p-4 border-b border-[#25365a]/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9fb4d0]">Zobrazit verzi:</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={!viewingV9 ? 'default' : 'outline'}
                    onClick={() => setViewingV9(false)}
                    className={!viewingV9 ? 'bg-[#25365a] text-[#e6f1ff]' : 'border-[#25365a] text-[#9fb4d0]'}
                  >
                    Základní (v1)
                  </Button>
                  <Button
                    size="sm"
                    variant={viewingV9 ? 'default' : 'outline'}
                    onClick={() => setViewingV9(true)}
                    className={viewingV9 ? 'bg-[#06d6a0] text-[#0a0f1d]' : 'border-[#25365a] text-[#9fb4d0]'}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    v-9 Protocol
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-b border-[#25365a]/50 flex gap-3">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="border-[#25365a] text-[#e6f1ff] hover:bg-[#25365a]"
            >
              <Copy className="h-4 w-4 mr-2" />
              Kopírovat
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="border-[#25365a] text-[#e6f1ff] hover:bg-[#25365a]"
            >
              <Download className="h-4 w-4 mr-2" />
              Stáhnout
            </Button>
            <Button
              onClick={() => window.location.href = '/demo'}
              className="ml-auto bg-[#06d6a0] hover:bg-[#05c090] text-[#0a0f1d]"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Vytvořit podobného agenta
            </Button>
          </div>

          {/* Prompt Content */}
          <div className="p-6">
            <div className="prose prose-invert max-w-none markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#06d6a0', marginBottom: '1rem'}} {...props} />,
                  h2: ({node, ...props}) => <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#06d6a0', marginTop: '1.5rem', marginBottom: '0.75rem'}} {...props} />,
                  h3: ({node, ...props}) => <h3 style={{fontSize: '1.125rem', fontWeight: '600', color: '#9fb4d0', marginTop: '1rem', marginBottom: '0.5rem'}} {...props} />,
                  p: ({node, ...props}) => <p style={{color: '#e6f1ff', marginBottom: '1rem', lineHeight: '1.75'}} {...props} />,
                  ul: ({node, ...props}) => <ul style={{listStyleType: 'disc', listStylePosition: 'inside', color: '#e6f1ff', marginBottom: '1rem'}} {...props} />,
                  ol: ({node, ...props}) => <ol style={{listStyleType: 'decimal', listStylePosition: 'inside', color: '#e6f1ff', marginBottom: '1rem'}} {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline 
                      ? <code style={{backgroundColor: '#25365a', color: '#06d6a0', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem'}} {...props} />
                      : <code style={{display: 'block', backgroundColor: '#0a0f1d', color: '#06d6a0', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginBottom: '1rem'}} {...props} />,
                }}
              >
                {currentPrompt}
              </ReactMarkdown>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SharedAgent;
