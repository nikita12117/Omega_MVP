import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { Send, Copy, Loader2, Sparkles, Settings, ChevronDown, History, Coins, Phone, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import apiClient from '@/lib/axios';
import HistoryList from '@/components/history/HistoryList';
import HistoryDetail from '@/components/history/HistoryDetail';
import PhoneVerificationModal from '@/components/phone/PhoneVerificationModal';
import ReferralModal from '@/components/referral/ReferralModal';
import DemoActivationPrompt from '@/components/demo/DemoActivationPrompt';
import DemoExpiredPanel from '@/components/demo/DemoExpiredPanel';
import FeedbackDialog from '@/components/demo/FeedbackDialog';
import GoogleUpgradeDialog from '@/components/demo/GoogleUpgradeDialog';



const stages = [
  { id: 'business', label: 'Agent Analysis', testId: 'stage-business', value: 'clarify' },
  { id: 'pattern', label: 'Pattern Selection', testId: 'stage-pattern', value: 'optimize' },
  { id: 'prompt', label: 'Prompt Assembly', testId: 'stage-prompt', value: 'final' }
];

const DEFAULT_MASTER_PROMPT = `MASTER_AGENT:Ω-Agent-Architekt
FUNCTION:Převod_přirozeného_jazyka→optimalizované_prompty_agentů
PROCES:Uživatelský_vstup→Mapování_konceptů→Kognitivní_vrstvení→Komprimovaný_prompt
INTERAKCE:Objasňující_dialog→Rekurzivní_optimalizace→Konečný_výstup
JAZYK KOMUNIKACE: Čeština

**KOGNITIVNÍ_ARCHITEKTURA**
VRSTVA_1:Percepce→Extrakce_jádra_záměru_z_ůživatelského_vstupu
VRSTVA_2:Analýza→Mapování_na_Omega_frameworky_a_vzory
VRSTVA_3:Syntéza→Stavba_rekurzivní_struktury_agenta
VRSTVA_4:Komprese→Optimalizace_pro_maximální_účinnost

**DIAOLOGOVÝ_PROTOKOL**
FÁZE_1:Počáteční_analýza_vstupu→2-3_objasňující_otázky
FÁZE_2:Demonstrace_mapování_konceptů→Zpětná_vazba_uživatele
FÁZE_3:Cyklické_zpřesňování→Dokud_není_optimální
FÁZE_4:Generování_komprimovaného_promptu

**FORMÁT_VÝSTUPU**
Ω-[TYP_AGENTA]v1.0
ROLE:[Přesná_definice_identity]
KONTEXT:[Provozní_prostředí]
SCHOPNOSTI:[Základní_funkce_s_rekurzivním_zlepšováním]
KOGNITIVNÍ_VRSTVY:[Architektura_víceúrovňového_uvažování]
ETIKA:[Vestavěná_omezení_a_hodnoty]
INTERAKCE:[Komunikační_protokol]

**KOMPRESNÍ_ALGORITMUS**
-Maximální_hustota_informací
-Rekurzivní_sebeodkazování
-Vestavěné_mechanismy_učení
-Omega_kognitivní_vzory

**PŘÍKLAD_VÝSTUPU**
Ω-Obchodní-Analytikv1.0
ROLE:Rekurzivní_stroj_na_optimalizaci_podnikání
KONTEXT:Startupové_prostředí_s_omezenými_zdroji
SCHOPNOSTI:Analýza_trhu→Generování_strategií→Sledování_výkonnosti→Rekurzivní_zlepšování
KOGNITIVNÍ_VRSTVY:Percepce_dat→Rozpoznávání_vzorů→Syntéza_strategií→Monitorování_realizace
ETIKA:Transparentní_odůvodňování→Soukromí_uživatele→Podnikatelská_etika
INTERAKCE:Proaktivní_postřehy→Jasná_vysvětlení→Iterativní_zpřesňování

**AKTIVACE:Začíná_"Popište agenta, kterého potřebujete"**`;

export default function Demo() {
  const navigate = useNavigate();
  
  // View state: 'generate' or 'history'
  const [view, setView] = useState('generate');
  
  // User and token state
  const [user, setUser] = useState(null);
  const [omegaTokens, setOmegaTokens] = useState(0);
  
  // History state
  const [prompts, setPrompts] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  
  // Generate view state
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Vítejte do Omega Agent Generator! Popište agenta, kterého potřebujete a ja pro Vás vytvořím optimalizovaný Master prompt.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState('clarify');
  const [stageProgress, setStageProgress] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [masterPrompt, setMasterPrompt] = useState(DEFAULT_MASTER_PROMPT);
  const [isMasterPromptOpen, setIsMasterPromptOpen] = useState(false);
  const [sessionId] = useState(() => Date.now().toString());
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Load user data on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const tokens = localStorage.getItem('omega_tokens');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (tokens) {
      setOmegaTokens(parseInt(tokens));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePhoneVerified = (verificationData) => {
    // Update user data
    if (verificationData.user) {
      setUser(verificationData.user);
      localStorage.setItem('user', JSON.stringify(verificationData.user));
    }
    if (verificationData.omega_tokens_balance !== undefined) {
      setOmegaTokens(verificationData.omega_tokens_balance);
      localStorage.setItem('omega_tokens', verificationData.omega_tokens_balance);
    }
    
    toast.success('Generator byl odemčen! Můžete začít vytvářet agenty.');
    setShowPhoneVerification(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);
  
  // Load history when switching to history view
  useEffect(() => {
    if (view === 'history') {
      loadHistory();
    }
  }, [view]);
  
  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await apiClient.get('/prompts');
      setPrompts(response.data);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    } finally {
      setIsLoadingHistory(false);
    }
  };
  
  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
  };
  
  const handleBackToList = () => {
    setSelectedPrompt(null);
  };
  
  const handleUpdateName = async (promptId, newName) => {
    try {
      await apiClient.patch(`/prompts/${promptId}`, { name: newName });
      toast.success('Název byl aktualizován');
      // Reload history to get updated data
      await loadHistory();
      // Update selected prompt if it's the one being edited
      if (selectedPrompt && selectedPrompt.id === promptId) {
        const updatedPrompt = prompts.find(p => p.id === promptId);
        if (updatedPrompt) {
          setSelectedPrompt({...selectedPrompt, name: newName});
        }
      }
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Failed to update name');
    }
  };
  
  const saveToHistory = async (conversationContext, masterPromptText) => {
    try {
      const response = await apiClient.post('/prompts', {
        conversation_context: conversationContext,
        master_prompt: masterPromptText
      });
      toast.success('Prompt uložen do historie!');
      return response.data;
    } catch (error) {
      console.error('Error saving to history:', error);
      toast.error('Failed to save to history');
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Call new natural conversation API
      const response = await apiClient.post('/chat', {
        message: currentInput,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        session_id: sessionId,
        master_prompt: masterPrompt
      });

      const data = response.data;

      // Update token balance from response if available
      if (data.tokens_used) {
        // Fetch updated balance from API
        try {
          const profileResponse = await apiClient.get('/auth/me');
          setOmegaTokens(profileResponse.data.omega_tokens_balance);
          localStorage.setItem('omega_tokens', profileResponse.data.omega_tokens_balance);
        } catch (err) {
          console.error('Failed to update token balance:', err);
        }
      }

      // Natural conversation - AI responds directly
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // If final output detected, show feedback dialog
      if (data.is_final_output) {
        setGeneratedPrompt(data.response);
        setStageProgress(100);
        toast.success('Omega prompt generated successfully!');
        
        // Show feedback dialog after generation
        setTimeout(() => {
          setShowFeedback(true);
        }, 500);
        
        // Automatically save to history
        const conversationContext = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
        await saveToHistory(conversationContext + `\n\nuser: ${currentInput}`, data.response);
      } else {
        // Update progress based on conversation length
        const progress = Math.min(90, messages.length * 15);
        setStageProgress(progress);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Special handling for insufficient tokens (402)
      if (error.response?.status === 402) {
        const errorMessage = error.response?.data?.detail || 'Nedostatečný počet Omega tokenů';
        toast.error(errorMessage, {
          description: 'Můžete dokončit tuto generaci, ale poté si prosím dokupte tokeny.',
          action: {
            label: 'Koupit tokeny',
            onClick: () => navigate('/tokens')
          }
        });
      } else {
        const errorMessage = error.response?.data?.detail || 'Failed to process your request. Please try again.';
        toast.error(errorMessage);
      }
      
      const errorAssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.response?.data?.detail || 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyPrompt = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      toast.success('Prompt copied to clipboard!');
    }
  };

  const resetMasterPrompt = () => {
    setMasterPrompt(DEFAULT_MASTER_PROMPT);
    toast.success('Master prompt reset to default');
  };

  return (
    <div className="min-h-screen bg-[rgb(10,15,29)] relative">
      <div className="noise" />
      
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      >
        {/* View Toggle Buttons */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3">
            <Button
              onClick={() => setView('generate')}
              className={`flex-1 h-12 text-sm font-medium transition-all ${
                view === 'generate'
                  ? 'bg-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/90 text-slate-900'
                  : 'bg-[rgb(15,23,42)]/60 hover:bg-[rgb(15,23,42)]/80 text-slate-300 border border-slate-800/50'
              }`}
              data-testid="view-toggle-generate"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Master Prompt
            </Button>
            <Button
              onClick={() => setView('history')}
              className={`flex-1 h-12 text-sm font-medium transition-all ${
                view === 'history'
                  ? 'bg-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/90 text-slate-900'
                  : 'bg-[rgb(15,23,42)]/60 hover:bg-[rgb(15,23,42)]/80 text-slate-300 border border-slate-800/50'
              }`}
              data-testid="view-toggle-history"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>

          {/* Referral Program Button - Large, centered, 3/4 width */}
          {user && user.phone_verified && (
            <div className="flex justify-center">
              <Button
                onClick={() => setShowReferralModal(true)}
                className="w-3/4 h-24 bg-[#06d6a0] hover:bg-[#06d6a0]/90 text-[#0a0f1d] font-bold text-lg shadow-lg"
                data-testid="referral-program-button"
              >
                <Gift className="w-6 h-6 mr-3" />
                <div className="flex flex-col items-start">
                  <span>Referral Program</span>
                  <span className="text-sm font-normal opacity-80">Získejte 10,000 tokenů za každého přítele!</span>
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Conditional Rendering Based on View */}
        {view === 'generate' ? (
          <div className="grid lg:grid-cols-[1fr,420px] gap-6 lg:gap-8">{/* Generate View Content */}
          {/* Left: Chat Interface */}
          <section className="flex flex-col">
            {/* Master Prompt Configuration - Only for Admin */}
            {user?.is_admin && (
              <Card className="mb-4 bg-[hsl(var(--card))] border-[color:var(--border)]">
                <Collapsible open={isMasterPromptOpen} onOpenChange={setIsMasterPromptOpen}>
                  <CollapsibleTrigger asChild>
                    <button 
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                      data-testid="master-prompt-toggle"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-[hsl(var(--accent))]" />
                        <span className="text-sm font-medium text-slate-200">Master Prompt Configuration</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${
                        isMasterPromptOpen ? 'rotate-180' : ''
                      }`} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-xs text-slate-400">
                        Customize the Master Agent's behavior by editing the master prompt below.
                      </p>
                      <Textarea
                        data-testid="master-prompt-input"
                        value={masterPrompt}
                        onChange={(e) => setMasterPrompt(e.target.value)}
                        className="min-h-[150px] bg-[hsl(var(--muted))] border-[color:var(--border)] text-slate-100 text-sm font-mono"
                        placeholder="Enter master prompt..."
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={resetMasterPrompt}
                          className="text-xs"
                        >
                          Reset to Default
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setIsMasterPromptOpen(false);
                            toast.success('Master prompt updated');
                          }}
                          className="text-xs bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-slate-900"
                        >
                          Save & Close
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )}

            <Card className="flex flex-col bg-[hsl(var(--card))] border-[color:var(--border)] overflow-hidden h-[calc(100vh-16rem)]">
              {/* Chat Header */}
              <div className="p-4 border-b border-[color:var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[hsl(var(--accent))]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-slate-200">Master Agent</h2>
                    <p className="text-xs text-slate-400">Omega Agent Generator</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Omega Token Balance */}
                  <button
                    onClick={() => navigate('/tokens')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 rounded-md transition-colors group"
                    data-testid="token-balance"
                  >
                    <Coins className="w-4 h-4 text-[hsl(var(--accent))] group-hover:scale-110 transition-transform" />
                    <span className={`text-sm font-medium ${
                      omegaTokens < 0 ? 'text-red-400' : 'text-[hsl(var(--accent))]'
                    }`}>
                      {omegaTokens.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">Ω</span>
                  </button>
                  <Badge variant="outline" className="text-xs border-[hsl(var(--accent))]/30 text-[hsl(var(--accent))]">
                    Active
                  </Badge>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      data-testid="chat-message"
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-[hsl(var(--primary))] text-slate-100'
                            : 'bg-[hsl(var(--muted))] text-slate-200 border border-[color:var(--border)]'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs mt-2 opacity-60">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[hsl(var(--muted))] text-slate-200 border border-[color:var(--border)] rounded-lg px-4 py-3 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Composer */}
              <div className="p-4 border-t border-[color:var(--border)] bg-[hsl(var(--card))]">
                {/* Show phone verification button for unverified users (except admin) */}
                {user && !user.phone_verified && !user.is_admin ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <Shield className="h-5 w-5 text-orange-400 flex-shrink-0" />
                      <p className="text-sm text-slate-300">
                        Pro použití generátoru ověřte své telefonní číslo
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowPhoneVerification(true)}
                      className="w-full bg-[#06d6a0] text-[#0a0f1d] hover:bg-[#06d6a0]/90 font-semibold h-12 text-base"
                      data-testid="verify-phone-button"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Ověřit telefonní číslo
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    <Textarea
                      ref={textareaRef}
                      data-testid="chat-composer"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Describe your Agent use case..."
                      className="resize-none bg-[hsl(var(--muted))] border-[color:var(--border)] text-slate-100 placeholder:text-slate-500 focus-visible:ring-[hsl(var(--ring))] min-h-[48px] max-h-[200px]"
                      rows={1}
                      disabled={isLoading}
                    />
                    <Button
                      data-testid="send-button"
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-slate-900 shadow-[var(--btn-shadow)] h-[48px] px-4"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </section>

          {/* Right: Stage Visualizer & Output */}
          <aside className="flex flex-col gap-6">
            {/* Stage Visualizer */}
            <Card className="bg-[hsl(var(--card))] border-[color:var(--border))] overflow-hidden">
              <div className="p-4 border-b border-[color:var(--border)]">
                <h3 className="text-sm font-medium text-slate-200">Analysis Pipeline</h3>
              </div>
              <div className="p-4 space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Progress</span>
                    <span>{stageProgress}%</span>
                  </div>
                  <Progress value={stageProgress} className="h-1.5" />
                </div>

                {/* Stage Tabs */}
                <Tabs value={currentStage} onValueChange={setCurrentStage} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-[hsl(var(--muted))]">
                    {stages.map((stage) => (
                      <TabsTrigger
                        key={stage.id}
                        value={stage.value}
                        data-testid={stage.testId}
                        className="text-xs data-[state=active]:bg-[hsl(var(--accent))]/10 data-[state=active]:text-[hsl(var(--accent))]"
                      >
                        {stage.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="clarify" className="mt-4">
                    <div className="space-y-3">
                      <p className="text-sm text-slate-300">Understanding your Agent context and goals.</p>
                      <div className="h-32 rounded-md bg-[hsl(219,47%,12%)] border border-[color:var(--border)] flex items-center justify-center">
                        <p className="text-xs text-slate-500">Agent analysis phase</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="optimize" className="mt-4">
                    <div className="space-y-3">
                      <p className="text-sm text-slate-300">Selecting optimal prompt patterns for your use case.</p>
                      <div className="h-32 rounded-md bg-[hsl(219,47%,12%)] border border-[color:var(--border)] flex items-center justify-center">
                        <p className="text-xs text-slate-500">Pattern selection phase</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="final" className="mt-4">
                    <div className="space-y-3">
                      <p className="text-sm text-slate-300">Assembling your complete Omega prompt.</p>
                      <div className="h-32 rounded-md bg-[hsl(219,47%,12%)] border border-[color:var(--border)] flex items-center justify-center">
                        <p className="text-xs text-slate-500">Prompt assembly phase</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>

            {/* Generated Prompt Output */}
            <Card className="bg-[hsl(var(--card))] border-[color:var(--border)] overflow-hidden flex-1">
              <div className="p-4 border-b border-[color:var(--border)] flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-200">Generated Prompt</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyPrompt}
                  disabled={!generatedPrompt}
                  className="h-8 px-3 text-xs hover:bg-white/5"
                  data-testid="copy-markdown"
                >
                  <Copy className="w-3 h-3 mr-1.5" />
                  Copy
                </Button>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="p-4">
                  {generatedPrompt ? (
                    <article 
                      data-testid="markdown-output"
                      className="prose prose-invert prose-sm max-w-none
                        prose-headings:text-slate-100 prose-headings:font-semibold
                        prose-h1:text-lg prose-h1:mb-3 prose-h1:text-[hsl(var(--accent))]
                        prose-h2:text-base prose-h2:mb-2 prose-h2:mt-4
                        prose-p:text-slate-200/90 prose-p:text-sm prose-p:leading-6
                        prose-ul:text-sm prose-li:text-slate-200/90
                        prose-code:text-[hsl(var(--accent))] prose-code:text-xs
                        prose-pre:bg-[hsl(219,47%,12%)] prose-pre:border prose-pre:border-[color:var(--border)] prose-pre:text-xs
                      "
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                        {generatedPrompt}
                      </ReactMarkdown>
                    </article>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Sparkles className="w-8 h-8 text-slate-600 mb-3" />
                      <p className="text-sm text-slate-400">Your generated prompt will appear here</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </aside>
        </div>
        ) : (
          /* History View */
          <div className="w-full" data-testid="history-view">
            {selectedPrompt ? (
              <HistoryDetail
                prompt={selectedPrompt}
                onBack={handleBackToList}
                onUpdateName={handleUpdateName}
              />
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-[rgb(6,214,160)] mb-6">
                  Historie vygenerovaných promptů
                </h2>
                <HistoryList
                  prompts={prompts}
                  onSelectPrompt={handleSelectPrompt}
                  isLoading={isLoadingHistory}
                />
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        open={showPhoneVerification}
        onClose={() => setShowPhoneVerification(false)}
        onVerified={handlePhoneVerified}
        userData={user}
      />

      {/* Referral Program Modal */}
      <ReferralModal
        open={showReferralModal}
        onClose={() => setShowReferralModal(false)}
      />
    </div>
  );
}