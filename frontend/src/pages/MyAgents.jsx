import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Eye,
  Calendar,
  Coins,
  Loader2,
  Brain,
  FileText,
  Search,
  Filter,
  X,
  Share2,
  Link as LinkIcon,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import apiClient from '@/lib/axios';
import OmegaLogo from '@/components/OmegaLogo';
import V9TransformButton from '@/components/V9TransformButton';

const MyAgents = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [viewingV9, setViewingV9] = useState(false);
  const [transformingAgentId, setTransformingAgentId] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterV9, setFilterV9] = useState('all'); // 'all', 'v9-only', 'v1-only'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'name'
  const [sharingAgentId, setSharingAgentId] = useState(null);
  const [copiedShareLink, setCopiedShareLink] = useState(null);

  // Load user first
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await apiClient.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [navigate]);

  // Load agents after user is loaded
  useEffect(() => {
    if (user) {
      loadAgents();
    }
  }, [user]);

  const loadAgents = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/agents/my-agents?limit=50');
      setAgents(response.data.agents || []);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast.error('Chyba při načítání agentů');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPrompt = (agent, isV9 = false) => {
    setSelectedAgent(agent);
    setViewingV9(isV9);
    setShowPromptModal(true);
  };

  const handleCopy = () => {
    const prompt = viewingV9 && selectedAgent?.metadata?.v9_prompt
      ? selectedAgent.metadata.v9_prompt
      : selectedAgent?.generated_prompt;
    
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt zkopírován!');
  };

  const handleDownload = () => {
    const prompt = viewingV9 && selectedAgent?.metadata?.v9_prompt
      ? selectedAgent.metadata.v9_prompt
      : selectedAgent?.generated_prompt;
    
    // Extract clean agent name for filename
    let filename = 'omega-agent.md';
    if (selectedAgent?.agent_name) {
      // Remove markdown formatting and special chars
      const cleanName = selectedAgent.agent_name
        .replace(/[#*_`]/g, '')
        .replace(/Ω-/g, '')
        .replace(/-v9/g, '')
        .replace(/v\d+\.\d+/g, '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
      
      filename = viewingV9 ? `${cleanName}-v9.md` : `${cleanName}.md`;
    }
    
    const blob = new Blob([prompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Prompt stažen!');
  };

  const handleV9Transform = async (agentId) => {
    setTransformingAgentId(agentId);

    try {
      const response = await apiClient.post(`/agent/${agentId}/v9-transform`);

      // Update the agent in the list
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId 
            ? {
                ...agent,
                has_v9: true,
                metadata: {
                  ...agent.metadata,
                  v9_prompt: response.data.agent_prompt_markdown
                },
                total_tokens_used: agent.total_tokens_used + response.data.tokens_used
              }
            : agent
        )
      );
      
      // Refresh user to update token balance
      const userResponse = await apiClient.get('/auth/me');
      setUser(userResponse.data);
      
      toast.success(`v-9 transformace dokončena! Použito ${response.data.tokens_used} tokenů`);
    } catch (error) {
      console.error('Error transforming to v-9:', error);
      toast.error(error.response?.data?.detail || 'Chyba při v-9 transformaci');
    } finally {
      setTransformingAgentId(null);
    }
  };

  const handleShare = async (agentId, currentlyShared) => {
    setSharingAgentId(agentId);

    try {
      if (currentlyShared) {
        // Unshare
        await apiClient.post(`/agent/${agentId}/unshare`);
        
        // Update agent in list
        setAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === agentId 
              ? {
                  ...agent,
                  metadata: {
                    ...agent.metadata,
                    is_shared: false
                  }
                }
              : agent
          )
        );
        
        toast.success('Agent je nyní soukromý');
      } else {
        // Share
        const response = await apiClient.post(`/agent/${agentId}/share`);
        const shareUrl = `${window.location.origin}/shared/${response.data.share_token}`;
        
        // Update agent in list
        setAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === agentId 
              ? {
                  ...agent,
                  metadata: {
                    ...agent.metadata,
                    is_shared: true,
                    share_token: response.data.share_token
                  }
                }
              : agent
          )
        );
        
        // Copy link to clipboard
        navigator.clipboard.writeText(shareUrl);
        setCopiedShareLink(agentId);
        setTimeout(() => setCopiedShareLink(null), 3000);
        
        toast.success('Odkaz zkopírován! Agent je nyní veřejně sdílený');
      }
    } catch (error) {
      console.error('Error sharing agent:', error);
      toast.error(error.response?.data?.detail || 'Chyba při sdílení');
    } finally {
      setSharingAgentId(null);
    }
  };

  const handleCopyShareLink = (agent) => {
    const shareToken = agent.metadata?.share_token;
    if (shareToken) {
      const shareUrl = `${window.location.origin}/shared/${shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedShareLink(agent.id);
      setTimeout(() => setCopiedShareLink(null), 3000);
      toast.success('Odkaz zkopírován!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and search agents
  const filteredAgents = useMemo(() => {
    let filtered = [...agents];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(agent =>
        agent.agent_name?.toLowerCase().includes(query) ||
        agent.short_description?.toLowerCase().includes(query) ||
        agent.description?.toLowerCase().includes(query)
      );
    }

    // Apply v9 filter
    if (filterV9 === 'v9-only') {
      filtered = filtered.filter(agent => agent.has_v9);
    } else if (filterV9 === 'v1-only') {
      filtered = filtered.filter(agent => !agent.has_v9);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortBy === 'name') {
        return (a.agent_name || '').localeCompare(b.agent_name || '');
      }
      return 0;
    });

    return filtered;
  }, [agents, searchQuery, filterV9, sortBy]);

  if (isLoadingUser || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <OmegaLogo size={60} />
          <Loader2 className="h-8 w-8 animate-spin text-[#06d6a0]" />
          <p className="text-[#9fb4d0]">Načítám vaše agenty...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#e6f1ff]">
      {/* Header */}
      <div className="border-b border-[#25365a]/50 bg-[#10172a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-[#06d6a0]" />
            <div className="flex-1">
              <h1 className="text-3xl font-semibold">Moji Agenti</h1>
              <p className="text-[#9fb4d0] mt-1">
                {filteredAgents.length} {filteredAgents.length === 1 ? 'agent' : 'agentů'}
                {searchQuery || filterV9 !== 'all' ? ` (filtrováno z ${agents.length})` : ''}
              </p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          {agents.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9fb4d0]" />
                <Input
                  type="text"
                  placeholder="Hledat podle názvu nebo popisu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-[#10172a] border-[#25365a] text-[#e6f1ff] placeholder:text-[#9fb4d0]/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9fb4d0] hover:text-[#e6f1ff]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* V9 Filter */}
              <Select value={filterV9} onValueChange={setFilterV9}>
                <SelectTrigger className="w-full sm:w-48 bg-[#10172a] border-[#25365a] text-[#e6f1ff]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#10172a] border-[#25365a]">
                  <SelectItem value="all" className="text-[#e6f1ff]">Všechny agenty</SelectItem>
                  <SelectItem value="v9-only" className="text-[#06d6a0]">Pouze v-9</SelectItem>
                  <SelectItem value="v1-only" className="text-[#9fb4d0]">Pouze v1</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-[#10172a] border-[#25365a] text-[#e6f1ff]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#10172a] border-[#25365a]">
                  <SelectItem value="newest" className="text-[#e6f1ff]">Nejnovější</SelectItem>
                  <SelectItem value="oldest" className="text-[#e6f1ff]">Nejstarší</SelectItem>
                  <SelectItem value="name" className="text-[#e6f1ff]">Podle názvu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {agents.length === 0 ? (
          <Card className="bg-[#10172a] border-[#25365a] p-12 text-center">
            <Sparkles className="h-16 w-16 text-[#06d6a0] mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">Zatím jste nevytvořili žádného agenta</h2>
            <p className="text-[#9fb4d0] mb-6">
              Vytvořte svého prvního Omega Agenta a začněte využívat sílu AI!
            </p>
            <Button
              onClick={() => window.location.href = '/demo'}
              className="bg-[#06d6a0] hover:bg-[#05c090] text-[#0a0f1d] font-semibold"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Vytvořit agenta
            </Button>
          </Card>
        ) : filteredAgents.length === 0 ? (
          <Card className="bg-[#10172a] border-[#25365a] p-12 text-center">
            <Search className="h-16 w-16 text-[#9fb4d0] mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">Žádní agenti nenalezeni</h2>
            <p className="text-[#9fb4d0] mb-6">
              Zkuste změnit vyhledávací kritéria nebo filtry
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setFilterV9('all');
              }}
              variant="outline"
              className="border-[#25365a] text-[#e6f1ff] hover:bg-[#25365a]"
            >
              Vymazat filtry
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className="bg-[#10172a] border-[#25365a] p-6 hover:border-[#06d6a0]/50 transition-all cursor-pointer group"
                  data-testid={`agent-card-${agent.id}`}
                  onClick={() => handleViewPrompt(agent, agent.has_v9)}
                >
                  {/* Agent Name */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#e6f1ff] line-clamp-1">
                      {agent.agent_name}
                    </h3>
                    {agent.has_v9 && (
                      <Badge className="bg-[#06d6a0]/10 text-[#06d6a0] border-[#06d6a0]/30 ml-2 flex-shrink-0">
                        v-9
                      </Badge>
                    )}
                  </div>

                  {/* AI-Generated Short Description */}
                  <p className="text-sm text-[#9fb4d0] mb-4 line-clamp-3">
                    {agent.short_description || agent.description}
                  </p>

                  <Separator className="mb-4 bg-[#25365a]/50" />

                  {/* Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-[#9fb4d0]">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(agent.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-[#9fb4d0]">
                      <Coins className="h-3 w-3 text-[#06d6a0]" />
                      <span>{agent.total_tokens_used?.toLocaleString()} tokenů celkem</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#9fb4d0]">
                      <Brain className="h-3 w-3 text-[#1e3a8a]" />
                      <span>{agent.master_prompt_version}</span>
                    </div>
                  </div>

                  {/* v-9 Transform Button (only if not already transformed) */}
                  {!agent.has_v9 && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <V9TransformButton
                        onClick={() => handleV9Transform(agent.id)}
                        isTransforming={transformingAgentId === agent.id}
                        disabled={transformingAgentId === agent.id}
                        className="w-full bg-[#10172a] border border-[#25365a] hover:border-[#06d6a0]/50 text-white font-semibold h-9 text-sm"
                      />
                    </div>
                  )}

                  {/* Share Button */}
                  <div onClick={(e) => e.stopPropagation()} className={!agent.has_v9 ? 'mt-2' : ''}>
                    {agent.metadata?.is_shared ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopyShareLink(agent)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[#06d6a0] text-[#06d6a0] hover:bg-[#06d6a0]/10 h-9 text-sm"
                        >
                          {copiedShareLink === agent.id ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Zkopírováno!
                            </>
                          ) : (
                            <>
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Kopírovat odkaz
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleShare(agent.id, true)}
                          disabled={sharingAgentId === agent.id}
                          variant="outline"
                          size="sm"
                          className="border-[#25365a] text-[#9fb4d0] hover:bg-[#25365a] h-9 px-3"
                        >
                          {sharingAgentId === agent.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleShare(agent.id, false)}
                        disabled={sharingAgentId === agent.id}
                        variant="outline"
                        className="w-full border-[#25365a] text-[#e6f1ff] hover:bg-[#25365a] h-9 text-sm"
                      >
                        {sharingAgentId === agent.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Share2 className="h-4 w-4 mr-2" />
                        )}
                        Sdílet agenta
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt View Modal */}
      <Dialog open={showPromptModal} onOpenChange={setShowPromptModal}>
        <DialogContent className="max-w-5xl max-h-[85vh] bg-[#10172a] border-[#25365a] text-[#e6f1ff]">
          <DialogHeader className="pr-12">
            <DialogTitle className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {selectedAgent?.agent_name}
                </span>
                {selectedAgent?.has_v9 && viewingV9 && (
                  <Badge className="bg-[#06d6a0]/10 text-[#06d6a0] border-[#06d6a0]/30">
                    v-9 Protocol
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                {/* Version Toggle */}
                {selectedAgent?.has_v9 && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setViewingV9(false)}
                      variant={!viewingV9 ? "default" : "outline"}
                      size="sm"
                      className={!viewingV9 
                        ? "bg-[#1e3a8a] hover:bg-[#2a4aa0]" 
                        : "border-[#25365a] hover:bg-[#152040]"}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Basic
                    </Button>
                    <Button
                      onClick={() => setViewingV9(true)}
                      variant={viewingV9 ? "default" : "outline"}
                      size="sm"
                      className={viewingV9
                        ? "bg-gradient-to-r from-[#1e3a8a] to-[#06d6a0]" 
                        : "border-[#25365a] hover:bg-[#152040]"}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      v-9 Protocol
                    </Button>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2 ml-auto">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="border-[#25365a] hover:bg-[#152040]"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Kopírovat
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="border-[#25365a] hover:bg-[#152040]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Stáhnout
                  </Button>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Separator className="bg-[#25365a]/50" />

          <ScrollArea className="h-[550px] rounded-lg border border-[#25365a] bg-[#0f1b33] p-6">
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {viewingV9 && selectedAgent?.metadata?.v9_prompt
                  ? selectedAgent.metadata.v9_prompt
                  : selectedAgent?.generated_prompt || ''}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAgents;
