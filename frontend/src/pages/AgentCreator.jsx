import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Download, 
  Loader2, 
  Brain, 
  MessageSquare, 
  CheckCircle,
  ArrowRight,
  Coins,
  FileText,
  LayoutTemplate,
  Share2,
  QrCode
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import apiClient from '@/lib/axios';
import OmegaLogo from '@/components/OmegaLogo';
import DemoActivationPrompt from '@/components/demo/DemoActivationPrompt';
import DemoExpiredPanel from '@/components/demo/DemoExpiredPanel';
import PhoneVerificationModal from '@/components/phone/PhoneVerificationModal';
import V9TransformButton from '@/components/V9TransformButton';
import TemplatesDialog from '@/components/TemplatesDialog';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Ω-KOMPRESNÍ ROVNICE - Agent Creator
 * 
 * Multi-stage agent creation flow:
 * 1. Describe - User describes what agent they need
 * 2. Clarify - AI asks 2-3 clarifying questions
 * 3. Refine - Generate concept map, optional follow-up
 * 4. Finalize - Generate final agent prompt in markdown
 */

const AgentCreator = () => {
  // User & Authentication State
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Agent Creation State
  const [currentStage, setCurrentStage] = useState('describe'); // describe, clarify, refine, finalize
  const [agentId, setAgentId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  
  // Form Data
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [finalPrompt, setFinalPrompt] = useState('');
  
  // v-9 Protocol State
  const [v9Prompt, setV9Prompt] = useState('');
  const [isV9Transformed, setIsV9Transformed] = useState(false);
  const [isTransformingV9, setIsTransformingV9] = useState(false);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [progress, setProgress] = useState(0);

  // Demo Ticket Sharing State
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [myTickets, setMyTickets] = useState([]);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [giftingStatus, setGiftingStatus] = useState(null);

  // Character count for description
  const maxDescriptionLength = 1000;
  const descriptionLength = description.length;

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoadingUser(false);
          return;
        }

        const response = await apiClient.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  // Load user's tickets if demo user
  useEffect(() => {
    if (user && user.is_demo) {
      loadMyTickets();
      loadGiftingStatus();
    }
  }, [user]);

  const loadMyTickets = async () => {
    try {
      const response = await apiClient.get('/demo/my-tickets');
      setMyTickets(response.data.tickets || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const loadGiftingStatus = async () => {
    try {
      const response = await apiClient.get('/demo/gifting-status');
      setGiftingStatus(response.data);
    } catch (error) {
      console.error('Error loading gifting status:', error);
    }
  };

  const handleCreateTicket = async () => {
    setIsCreatingTicket(true);
    try {
      const response = await apiClient.post('/demo/create-ticket');
      setCreatedTicket(response.data);
      setShowTicketModal(true);
      loadMyTickets();
      loadGiftingStatus();
      toast.success('Gift ticket vytvořen!');
    } catch (error) {
      console.error('Error creating ticket:', error);
      const errorMsg = error.response?.data?.detail || 'Chyba při vytváření ticketu';
      toast.error(errorMsg);
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleShowTicket = (ticket) => {
    setCreatedTicket(ticket);
    setShowTicketModal(true);
  };

  // Calculate progress
  useEffect(() => {
    const stageProgress = {
      'describe': 0,
      'clarify': 33,
      'refine': 66,
      'finalize': 100
    };
    setProgress(stageProgress[currentStage] || 0);
  }, [currentStage]);

  // STAGE 1: Start Agent Creation
  const handleStartAgent = async () => {
    if (!description.trim() || description.length < 20) {
      toast.error('Prosím popište agenta podrobněji (min. 20 znaků)');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/start-agent', {
        description: description.trim(),
        template_id: selectedTemplate?.id || null
      });

      setAgentId(response.data.agent_id);
      setSessionId(response.data.session_id);
      setQuestions(response.data.questions || []);
      setAnswers(new Array(response.data.questions.length).fill(''));
      setCurrentStage('clarify');

      toast.success('Agent vytváření zahájeno!');
    } catch (error) {
      console.error('Error starting agent:', error);
      
      if (error.response?.status === 401 && error.response?.headers?.['x-error-type'] === 'demo_expired') {
        toast.error('Váš demo účet vypršel');
        // Demo expiry handling will be done by axios interceptor
      } else if (error.response?.status === 403 && error.response?.headers?.['x-error-type'] === 'phone_verification_required') {
        setShowPhoneModal(true);
      } else {
        toast.error(error.response?.data?.detail || 'Chyba při vytváření agenta');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    // Append template preset to description
    setDescription(prev => {
      const trimmed = prev.trim();
      if (trimmed) {
        return `${template.preset_description}\n${trimmed}`;
      }
      return template.preset_description;
    });
    toast.success(`Šablona "${template.name}" vybrána`);
  };

  // STAGE 2: Refine with answers
  const handleRefineAgent = async () => {
    // Check if all questions are answered
    const allAnswered = answers.every(a => a.trim().length > 0);
    if (!allAnswered) {
      toast.error('Prosím odpovězte na všechny otázky');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post(`/agent/${agentId}/refine`, {
        answers: answers
      });

      setConcepts(response.data.concepts || []);
      setCurrentStage('refine');

      // If there are follow-up questions, add them
      if (response.data.follow_up_questions && response.data.follow_up_questions.length > 0) {
        setQuestions([...questions, ...response.data.follow_up_questions]);
        setAnswers([...answers, ...new Array(response.data.follow_up_questions.length).fill('')]);
        setCurrentStage('clarify'); // Stay in clarify stage
        toast.info('Několik dalších otázek...');
      } else {
        toast.success('Koncepty zmapovány!');
      }
    } catch (error) {
      console.error('Error refining agent:', error);
      toast.error(error.response?.data?.detail || 'Chyba při zpřesňování agenta');
    } finally {
      setIsLoading(false);
    }
  };

  // STAGE 3: Finalize agent
  const handleFinalizeAgent = async () => {
    setIsLoading(true);

    try {
      const response = await apiClient.post(`/agent/${agentId}/finalize`, {
        confirm: true
      });

      setFinalPrompt(response.data.agent_prompt_markdown);
      setTokensUsed(response.data.tokens_used);
      setCurrentStage('finalize');

      // Refresh user to update token balance
      const userResponse = await apiClient.get('/auth/me');
      setUser(userResponse.data);

      toast.success(`Agent vytvořen! Použito ${response.data.tokens_used} tokenů`);
    } catch (error) {
      console.error('Error finalizing agent:', error);
      toast.error(error.response?.data?.detail || 'Chyba při generování promptu');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    const promptToCopy = isV9Transformed ? v9Prompt : finalPrompt;
    navigator.clipboard.writeText(promptToCopy);
    toast.success(isV9Transformed ? 'v-9 Protocol zkopírován!' : 'Prompt zkopírován do schránky!');
  };

  // Download as markdown
  const handleDownload = () => {
    const promptToDownload = isV9Transformed ? v9Prompt : finalPrompt;
    
    // Extract agent name from the prompt
    let filename = 'omega-agent.md';
    const lines = promptToDownload.split('\n');
    for (const line of lines) {
      if (line.startsWith('#') && line.includes('Ω-')) {
        // Extract name between Ω- and v1.0 or -v9
        const cleanName = line
          .replace(/[#*_`]/g, '')
          .replace(/Ω-/g, '')
          .replace(/-v9/g, '')
          .replace(/v\d+\.\d+/g, '')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-');
        
        filename = isV9Transformed ? `${cleanName}-v9.md` : `${cleanName}.md`;
        break;
      }
    }
    
    const blob = new Blob([promptToDownload], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Prompt stažen!');
  };

  // Transform to v-9 protocol
  const handleV9Transform = async () => {
    setIsTransformingV9(true);

    try {
      const response = await apiClient.post(`/agent/${agentId}/v9-transform`);

      setV9Prompt(response.data.agent_prompt_markdown);
      setIsV9Transformed(true);
      
      if (!response.data.already_transformed) {
        setTokensUsed(prev => prev + response.data.tokens_used);
        
        // Refresh user to update token balance
        const userResponse = await apiClient.get('/auth/me');
        setUser(userResponse.data);
        
        toast.success(`v-9 transformace dokončena! Použito ${response.data.tokens_used} tokenů`);
      } else {
        toast.info('Agent již byl transformován na v-9 protokol');
      }
    } catch (error) {
      console.error('Error transforming to v-9:', error);
      toast.error(error.response?.data?.detail || 'Chyba při v-9 transformaci');
    } finally {
      setIsTransformingV9(false);
    }
  };

  // Reset to start new agent
  const handleReset = () => {
    setCurrentStage('describe');
    setAgentId(null);
    setSessionId(null);
    setDescription('');
    setQuestions([]);
    setAnswers([]);
    setConcepts([]);
    setFinalPrompt('');
    setV9Prompt('');
    setIsV9Transformed(false);
    setTokensUsed(0);
  };

  // Gating logic: Show prompts if unauthenticated or demo expired
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <OmegaLogo size={60} />
          <Loader2 className="h-8 w-8 animate-spin text-[#06d6a0]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <DemoActivationPrompt />;
  }

  // Check demo expiry
  if (user.is_demo && user.demo_expires_at) {
    const expiryTime = new Date(user.demo_expires_at);
    const now = new Date();
    if (now >= expiryTime) {
      return <DemoExpiredPanel user={user} />;
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#e6f1ff]">
      {/* Header with token balance */}
      <div className="border-b border-[#25365a]/50 bg-[#10172a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-[#06d6a0]" />
            <h1 className="text-xl font-semibold">Ω-Agent Creator</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/my-agents'}
              className="text-[#9fb4d0] hover:text-[#06d6a0] hover:bg-[#152040]"
              data-testid="view-my-agents-link"
            >
              <FileText className="h-4 w-4 mr-2" />
              Moji Agenti
            </Button>
            
            <Badge variant="outline" className="border-[#25365a] text-[#9fb4d0] gap-2">
              <Coins className="h-4 w-4 text-[#06d6a0]" />
              {user?.omega_tokens_balance?.toLocaleString() || 0} tokenů
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#9fb4d0]">Průběh vytváření</span>
            <span className="text-sm text-[#06d6a0] font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stage: Describe */}
        {currentStage === 'describe' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-[#10172a] border-[#25365a] p-8" data-testid="describe-stage">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#06d6a0]/10">
                  <Sparkles className="h-6 w-6 text-[#06d6a0]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">Popište svého agenta</h2>
                  <p className="text-[#9fb4d0] mt-1">
                    Řekněte nám, co by měl váš Omega Agent dělat
                  </p>
                </div>
                <Button
                  onClick={() => setShowTemplatesDialog(true)}
                  variant="outline"
                  className="border-[#25365a] text-[#e6f1ff] hover:bg-[#25365a] gap-2"
                >
                  <LayoutTemplate className="h-4 w-4" />
                  Šablony
                </Button>
              </div>

              <Separator className="mb-6 bg-[#25365a]/50" />

              {selectedTemplate && (
                <div className="mb-4 p-4 bg-[#06d6a0]/10 border border-[#06d6a0]/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{selectedTemplate.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#06d6a0]">
                        Použitá šablona: {selectedTemplate.name}
                      </p>
                      <p className="text-xs text-[#9fb4d0]">
                        {selectedTemplate.description}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedTemplate(null);
                        setDescription('');
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-[#9fb4d0] hover:text-[#e6f1ff]"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Textarea
                  data-testid="agent-description-input"
                  placeholder="Příklad: Potřebuji agenta pro analýzu zákaznických zpětných vazeb. Agent by měl číst textové komentáře, identifikovat sentiment a poskytovat doporučení pro zlepšení produktu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, maxDescriptionLength))}
                  className="min-h-[200px] bg-[#0f1b33] border-[#25365a] text-[#e6f1ff] resize-none"
                  maxLength={maxDescriptionLength}
                />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9fb4d0]">
                    {descriptionLength}/{maxDescriptionLength} znaků
                  </span>
                  {descriptionLength < 20 && descriptionLength > 0 && (
                    <span className="text-yellow-500">Min. 20 znaků</span>
                  )}
                </div>

                <Button
                  data-testid="start-agent-btn"
                  onClick={handleStartAgent}
                  disabled={isLoading || descriptionLength < 20}
                  className="w-full bg-[#06d6a0] hover:bg-[#05c090] text-[#0a0f1d] font-semibold h-12"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generuji otázky...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Začít dialog
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stage: Clarify */}
        {currentStage === 'clarify' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-[#10172a] border-[#25365a] p-8" data-testid="clarify-stage">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#1e3a8a]/20">
                  <MessageSquare className="h-6 w-6 text-[#1e3a8a]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Objasňující otázky</h2>
                  <p className="text-[#9fb4d0] mt-1">
                    Odpovězte na několik otázek pro zpřesnění agenta
                  </p>
                </div>
              </div>

              <Separator className="mb-6 bg-[#25365a]/50" />

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium text-[#e6f1ff] flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#06d6a0]/10 text-[#06d6a0] text-xs">
                        {index + 1}
                      </span>
                      {question}
                    </label>
                    <Input
                      data-testid={`question-answer-${index}`}
                      placeholder="Vaše odpověď..."
                      value={answers[index] || ''}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      className="bg-[#0f1b33] border-[#25365a] text-[#e6f1ff]"
                    />
                  </div>
                ))}

                <Button
                  data-testid="refine-agent-btn"
                  onClick={handleRefineAgent}
                  disabled={isLoading || answers.some(a => !a.trim())}
                  className="w-full bg-[#1e3a8a] hover:bg-[#2a4aa0] text-white font-semibold h-12"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Zpracovávám...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Pokračovat
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stage: Refine (Concept Map) */}
        {currentStage === 'refine' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-[#10172a] border-[#25365a] p-8" data-testid="refine-stage">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#06d6a0]/10">
                  <Brain className="h-6 w-6 text-[#06d6a0]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Konceptuální mapa</h2>
                  <p className="text-[#9fb4d0] mt-1">
                    Klíčové koncepty vašeho agenta
                  </p>
                </div>
              </div>

              <Separator className="mb-6 bg-[#25365a]/50" />

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {concepts.map((concept, index) => (
                  <Card key={index} className="bg-[#0f1b33] border-[#25365a] p-4">
                    <h3 className="font-semibold text-[#06d6a0] mb-2">{concept.label}</h3>
                    <p className="text-sm text-[#9fb4d0]">{concept.description}</p>
                  </Card>
                ))}
              </div>

              <Button
                data-testid="finalize-agent-btn"
                onClick={handleFinalizeAgent}
                disabled={isLoading}
                className="w-full bg-[#06d6a0] hover:bg-[#05c090] text-[#0a0f1d] font-semibold h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generuji finální prompt...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Generovat finální prompt
                  </>
                )}
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Stage: Finalize (Show final prompt) */}
        {currentStage === 'finalize' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-[#10172a] border-[#25365a] p-8" data-testid="finalize-stage">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#06d6a0]/10">
                    <CheckCircle className="h-6 w-6 text-[#06d6a0]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {isV9Transformed ? 'Ω-Agent v-9 Protocol Ready!' : 'Váš Omega Agent je připraven!'}
                    </h2>
                    <p className="text-[#9fb4d0] mt-1">
                      {isV9Transformed 
                        ? 'Fractal Recursion & Self-Validation aktivní' 
                        : `Použito ${tokensUsed} tokenů`}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    data-testid="copy-prompt-btn"
                    onClick={handleCopy}
                    variant="outline"
                    className="border-[#25365a] hover:bg-[#152040]"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Kopírovat
                  </Button>
                  <Button
                    data-testid="download-prompt-btn"
                    onClick={handleDownload}
                    variant="outline"
                    className="border-[#25365a] hover:bg-[#152040]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Stáhnout
                  </Button>
                </div>
              </div>

              <Separator className="mb-6 bg-[#25365a]/50" />

              {/* v-9 Protocol Badge */}
              {isV9Transformed && (
                <div className="mb-4 p-3 rounded-lg bg-[#06d6a0]/10 border border-[#06d6a0]/30">
                  <div className="flex items-center gap-2 text-[#06d6a0] text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    <span>Ω-Textual Cognition Core v-9 Activated</span>
                  </div>
                  <p className="text-xs text-[#9fb4d0] mt-1">
                    Fractal recursion • Self-validation • 4-layer cognitive architecture • Coherence ≥ 0.999
                  </p>
                </div>
              )}

              <ScrollArea className="h-[600px] rounded-lg border border-[#25365a] bg-[#0f1b33] p-6">
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {isV9Transformed ? v9Prompt : finalPrompt}
                  </ReactMarkdown>
                </div>
              </ScrollArea>

              <div className="mt-6 flex gap-3">
                {!isV9Transformed && (
                  <V9TransformButton
                    onClick={handleV9Transform}
                    isTransforming={isTransformingV9}
                    disabled={isTransformingV9}
                    className="flex-1 bg-[#10172a] border-2 border-[#25365a] hover:border-[#06d6a0]/50 text-white font-semibold h-12 text-base"
                  >
                    Transformovat na v-9 Protocol
                  </V9TransformButton>
                )}
                
                <Button
                  data-testid="create-new-agent-btn"
                  onClick={handleReset}
                  className={`${isV9Transformed ? 'flex-1' : 'flex-1'} bg-[#1e3a8a] hover:bg-[#2a4aa0] text-white font-semibold h-12`}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Vytvořit dalšího agenta
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Phone Verification Modal */}
      {showPhoneModal && (
        <PhoneVerificationModal
          onClose={() => setShowPhoneModal(false)}
          onSuccess={() => {
            setShowPhoneModal(false);
            window.location.reload();
          }}
        />
      )}

      {/* Templates Dialog */}
      <TemplatesDialog
        open={showTemplatesDialog}
        onOpenChange={setShowTemplatesDialog}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Gift Ticket Section (For Demo Users) */}
      {user?.is_demo && giftingStatus && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            {/* Gift Ticket Button - Centered */}
            <Button
              onClick={handleCreateTicket}
              disabled={isCreatingTicket || !giftingStatus.can_gift}
              className="bg-[#06d6a0] hover:bg-[#07f0b8] text-[#0a0f1d] font-semibold h-14 px-8 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingTicket ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Gift...
                </>
              ) : (
                <>
                  <Share2 className="h-5 w-5 mr-2" />
                  🎁 Gift Ticket
                </>
              )}
            </Button>
            
            {/* Status Info */}
            <div className="mt-3 text-sm text-[#9fb4d0] space-y-1">
              <div className="flex items-center justify-center gap-4">
                <span className={giftingStatus.tickets_remaining > 0 ? 'text-[#06d6a0]' : 'text-[#ef4444]'}>
                  {giftingStatus.tickets_remaining}/7 tickets remaining
                </span>
                <span className="text-[#25365a]">•</span>
                <span className={giftingStatus.hours_remaining > 0 ? 'text-[#06d6a0]' : 'text-[#ef4444]'}>
                  {giftingStatus.hours_remaining}h left to gift
                </span>
              </div>
              {!giftingStatus.can_gift && (
                <p className="text-[#ef4444] mt-2">
                  {giftingStatus.reason === "Expired" 
                    ? "Gift period expired (12h limit)" 
                    : "Gift limit reached (7 max)"}
                </p>
              )}
            </div>
          </div>

          {/* My Gifted Tickets */}
          {myTickets.length > 0 && (
            <Card className="bg-[#10172a] border-[#25365a] p-6">
              <h3 className="text-xl font-semibold text-[#e6f1ff] mb-4 flex items-center gap-2">
                <QrCode className="h-5 w-5 text-[#06d6a0]" />
                My Gifted Tickets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => handleShowTicket(ticket)}
                    className="p-4 bg-[#0f1b33] border border-[#25365a] rounded-lg hover:border-[#06d6a0]/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="h-10 w-10 text-[#06d6a0]" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#e6f1ff] truncate">{ticket.label}</p>
                        <p className="text-xs text-[#9fb4d0]">
                          {ticket.activations_count} aktivací
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Ticket QR Modal */}
      <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
        <DialogContent className="bg-[#10172a] border-[#25365a] text-[#e6f1ff] max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <QrCode className="h-6 w-6 text-[#06d6a0]" />
              🎁 Gift Ticket
            </DialogTitle>
          </DialogHeader>
          
          {createdTicket && (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                <QRCodeSVG
                  value={createdTicket.activation_link}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Ticket Info */}
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[#9fb4d0]">Event:</span>{' '}
                  <span className="text-[#e6f1ff] font-semibold">{createdTicket.event_name}</span>
                </div>
                <div>
                  <span className="text-[#9fb4d0]">Label:</span>{' '}
                  <span className="text-[#e6f1ff]">{createdTicket.label}</span>
                </div>
                <div className="pt-2">
                  <div className="text-[#9fb4d0] mb-1">Activation URL:</div>
                  <code className="block bg-[#0f1b33] p-2 rounded text-xs text-[#06d6a0] break-all">
                    {createdTicket.activation_link}
                  </code>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(createdTicket.activation_link);
                    toast.success('URL zkopírována!');
                  }}
                  className="flex-1 bg-[#06d6a0] hover:bg-[#07f0b8] text-[#0a0f1d] font-semibold"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
                <Button
                  onClick={() => setShowTicketModal(false)}
                  variant="outline"
                  className="flex-1 border-[#25365a] text-[#e6f1ff] hover:bg-[#25365a]"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentCreator;
