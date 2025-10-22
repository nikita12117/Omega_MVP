import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { Search, User, Calendar, Star, Sparkles } from 'lucide-react';

const AgentMonitor = () => {
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, [statusFilter]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? { status_filter: statusFilter } : {};
      const response = await apiClient.get('/admin/agents/analytics', { params });
      
      setAgents(response.data.agents || []);
      setStats({
        total: response.data.total_agents,
        v9_count: response.data.v9_count,
        v1_only: response.data.v1_only_count
      });
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Chyba při načítání agentů');
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      agent.description?.toLowerCase().includes(search) ||
      agent.user_email?.toLowerCase().includes(search) ||
      agent.user_name?.toLowerCase().includes(search)
    );
  });

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
          <h2 className="text-4xl font-bold text-[#e6f1ff] mb-3">Agent Monitor</h2>
          <p className="text-lg text-[#9fb4d0]">
            Přehled všech vytvořených agentů s detaily a metrikami
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#10172a] border-[#25365a] hover:border-[#06d6a0]/50 transition-all">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#7a8fb8] mb-2">Celkem agentů</p>
                    <p className="text-5xl font-bold text-[#e6f1ff]">{stats.total}</p>
                  </div>
                  <div className="w-16 h-16 bg-[#1e3a8a]/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-[#1e3a8a]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#10172a] border-[#25365a] hover:border-[#06d6a0]/50 transition-all">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#7a8fb8] mb-2">v9 Agenti</p>
                    <p className="text-5xl font-bold text-[#06d6a0]">{stats.v9_count}</p>
                  </div>
                  <div className="w-16 h-16 bg-[#06d6a0]/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#06d6a0]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#10172a] border-[#25365a] hover:border-[#06d6a0]/50 transition-all">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#7a8fb8] mb-2">Pouze v1</p>
                    <p className="text-5xl font-bold text-[#9fb4d0]">{stats.v1_only}</p>
                  </div>
                  <div className="w-16 h-16 bg-[#9fb4d0]/10 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-[#9fb4d0]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-[#10172a] border-[#25365a]">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7a8fb8]" />
                <Input
                  placeholder="Hledat podle popisu nebo uživatele..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-[#0f1b33] border-[#25365a] text-[#e6f1ff] placeholder:text-[#7a8fb8] h-12"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-56 bg-[#0f1b33] border-[#25365a] text-[#e6f1ff] h-12">
                  <SelectValue placeholder="Filtr podle typu" />
                </SelectTrigger>
                <SelectContent className="bg-[#10172a] border-[#25365a]">
                  <SelectItem value="all" className="text-[#e6f1ff]">Všechny</SelectItem>
                  <SelectItem value="v9_only" className="text-[#e6f1ff]">Pouze v9</SelectItem>
                  <SelectItem value="v1_only" className="text-[#e6f1ff]">Pouze v1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Agents List */}
        <Card className="bg-[#10172a] border-[#25365a]">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-[#e6f1ff]">
              Agenti ({filteredAgents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAgents.length === 0 ? (
              <div className="text-center p-12 text-[#7a8fb8] text-lg">
                Žádní agenti nenalezeni
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAgents.map(agent => (
                  <div
                    key={agent.id}
                    className="border border-[#25365a] rounded-lg p-6 hover:bg-[#0f1b33] hover:border-[#06d6a0]/50 cursor-pointer transition-all"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={agent.v9_prompt ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                            {agent.v9_prompt ? 'v9' : 'v1'}
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-1 border-[#25365a] text-[#7a8fb8]">
                            {agent.master_prompt_version}
                          </Badge>
                          {agent.score && (
                            <div className="flex items-center gap-1 text-sm text-[#f59e0b]">
                              <Star className="w-4 h-4 fill-[#f59e0b]" />
                              <span>{agent.score.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-base font-medium text-[#e6f1ff] mb-3">
                          {agent.description}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-[#9fb4d0]">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{agent.user_name || agent.user_email || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(agent.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50 backdrop-blur-sm"
          onClick={() => setSelectedAgent(null)}
        >
          <Card 
            className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-[#10172a] border-[#25365a]"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b border-[#25365a] pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-[#e6f1ff]">Detail Agenta</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedAgent(null)} className="text-[#9fb4d0] hover:text-[#e6f1ff]">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <label className="text-sm font-medium text-[#7a8fb8] block mb-2">Popis</label>
                <p className="text-base text-[#e6f1ff]">{selectedAgent.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-[#7a8fb8] block mb-2">Verze</label>
                <div className="flex gap-3">
                  <Badge className="text-sm">{selectedAgent.v9_prompt ? 'v9' : 'v1'}</Badge>
                  <Badge variant="outline" className="text-sm border-[#25365a] text-[#9fb4d0]">{selectedAgent.master_prompt_version}</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#7a8fb8] block mb-2">Vytvořeno</label>
                <p className="text-base text-[#e6f1ff]">{formatDate(selectedAgent.created_at)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-[#7a8fb8] block mb-2">Uživatel</label>
                <p className="text-base text-[#e6f1ff]">
                  {selectedAgent.user_name} ({selectedAgent.user_email})
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-[#7a8fb8] mb-3 block">
                  Generovaný Prompt (v1)
                </label>
                <pre className="bg-[#0f1b33] border border-[#25365a] p-6 rounded text-sm overflow-auto max-h-64 whitespace-pre-wrap text-[#9fb4d0] font-mono">
                  {selectedAgent.generated_prompt}
                </pre>
              </div>

              {selectedAgent.v9_prompt && (
                <div>
                  <label className="text-sm font-medium text-[#7a8fb8] mb-3 block">
                    v9 Protokol Prompt
                  </label>
                  <pre className="bg-[#0f1b33] border-2 border-[#06d6a0]/30 p-6 rounded text-sm overflow-auto max-h-64 whitespace-pre-wrap text-[#06d6a0] font-mono">
                    {selectedAgent.v9_prompt}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AgentMonitor;