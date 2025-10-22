import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, Users, TrendingUp, Activity, Bot, Brain, MessageSquare, GitCommit, Lightbulb, QrCode, ArrowRight } from 'lucide-react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadOverview();
  }, []);
  
  const loadOverview = async () => {
    try {
      const response = await apiClient.get('/admin/overview');
      setData(response.data);
    } catch (error) {
      console.error('Error loading overview:', error);
      toast.error('Failed to load overview data');
      // Set empty data so the page can still render the dashboard cards
      setData({
        total_revenue: 0,
        total_users: 0,
        active_users_24h: 0,
        active_users_7d: 0,
        avg_tokens_per_agent: 0,
        min_consumption: null,
        max_consumption: null,
        token_history: []
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Načítání...</div>
      </div>
    );
  }
  
  // Always render the page, even if data fetch failed
  const safeData = data || {
    total_revenue: 0,
    total_users: 0,
    active_users_24h: 0,
    active_users_7d: 0,
    avg_tokens_per_agent: 0,
    min_consumption: null,
    max_consumption: null,
    token_history: []
  };
  
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <header className="relative p-6 border-b border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(6,214,160)]/5 to-transparent" />
        <div className="relative">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Přehled</h1>
          <p className="text-slate-400 text-sm mt-1">Klíčové metriky a spotřeba tokenů</p>
        </div>
      </header>
      
      {/* Learning Loop Dashboard Modules */}
      <section>
        <h2 className="text-lg font-semibold text-slate-100 mb-4">🧠 Learning Loop Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/agents">
            <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50 hover:border-[rgb(6,214,160)]/50 transition cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-5 h-5 text-blue-400" />
                      <h3 className="font-semibold text-slate-100">Agent Monitor</h3>
                    </div>
                    <p className="text-sm text-slate-400">Přehled všech vytvořených agentů</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[rgb(6,214,160)] transition" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/learning">
            <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50 hover:border-[rgb(6,214,160)]/50 transition cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <h3 className="font-semibold text-slate-100">Learning Loop</h3>
                    </div>
                    <p className="text-sm text-slate-400">Schvalování Master Prompt evolucí</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[rgb(6,214,160)] transition" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/live">
            <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50 hover:border-[rgb(6,214,160)]/50 transition cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-semibold text-slate-100">Live Monitor</h3>
                    </div>
                    <p className="text-sm text-slate-400">Real-time metriky a aktivita</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[rgb(6,214,160)] transition" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/feedback">
            <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50 hover:border-[rgb(6,214,160)]/50 transition cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-semibold text-slate-100">Feedback</h3>
                    </div>
                    <p className="text-sm text-slate-400">Sentiment analýza a trendy</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[rgb(6,214,160)] transition" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/versions">
            <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50 hover:border-[rgb(6,214,160)]/50 transition cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <GitCommit className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-semibold text-slate-100">Version Ledger</h3>
                    </div>
                    <p className="text-sm text-slate-400">Historie Master Promptů</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[rgb(6,214,160)] transition" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/insights">
            <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50 hover:border-[rgb(6,214,160)]/50 transition cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-orange-400" />
                      <h3 className="font-semibold text-slate-100">Meta Insights</h3>
                    </div>
                    <p className="text-sm text-slate-400">AI-generované poznatky</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[rgb(6,214,160)] transition" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/qr">
            <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50 hover:border-[rgb(6,214,160)]/50 transition cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="w-5 h-5 text-pink-400" />
                      <h3 className="font-semibold text-slate-100">QR Tokeny</h3>
                    </div>
                    <p className="text-sm text-slate-400">Správa demo aktivací</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[rgb(6,214,160)] transition" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
      
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <Card data-testid="overview-revenue-card" className="bg-[rgb(15,23,42)]/60 border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[rgb(6,214,160)]" />
              Celkové příjmy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-100">{safeData.total_revenue?.toLocaleString() || 0} Kč</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50" data-testid="overview-active-users-24h">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[rgb(0,255,255)]" />
              Aktivní uživatelé (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-100">{safeData.active_users_24h || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50" data-testid="overview-active-users-7d">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <Users className="h-4 w-4 text-[rgb(138,43,226)]" />
              Aktivní uživatelé (7d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-100">{safeData.active_users_7d || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[rgb(6,214,160)]" />
              Průměrné tokeny / agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-100">{Math.round(safeData.avg_tokens_per_agent || 0)}</div>
          </CardContent>
        </Card>
      </section>
      
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50" data-testid="overview-tokens-chart">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-100">Historická spotřeba tokenů</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-sm text-slate-400 cursor-help">Nápověda</TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border-slate-700">Denní součet spotřebovaných tokenů.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={safeData.token_history || []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(6,214,160)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="rgb(6,214,160)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgb(100,116,139)" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="day" stroke="rgb(148,163,184)" tick={{ fill: 'rgb(148,163,184)', fontSize: 12 }} />
                  <YAxis stroke="rgb(148,163,184)" tick={{ fill: 'rgb(148,163,184)', fontSize: 12 }} />
                  <RTooltip contentStyle={{ background: 'rgb(15,23,42)', border: '1px solid rgb(100,116,139)', color: 'rgb(226,232,240)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="tokens" stroke="rgb(6,214,160)" strokeWidth={2} fill="url(#fillArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-100">Min/Max spotřeba</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              <li className="flex flex-col gap-1">
                <span className="text-slate-400">Nejnižší spotřeba:</span>
                {safeData.min_consumption ? (
                  <div className="text-slate-100" data-testid="overview-min-consumption">
                    <div className="font-semibold text-[rgb(6,214,160)]">{safeData.min_consumption.tokens} tokenů</div>
                    <div className="text-xs text-slate-500 mt-1">{safeData.min_consumption.user_name} ({safeData.min_consumption.user_email})</div>
                  </div>
                ) : (
                  <span className="text-slate-500" data-testid="overview-min-consumption">—</span>
                )}
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-slate-400">Nejvyšší spotřeba:</span>
                {safeData.max_consumption ? (
                  <div className="text-slate-100" data-testid="overview-max-consumption">
                    <div className="font-semibold text-[rgb(138,43,226)]">{safeData.max_consumption.tokens} tokenů</div>
                    <div className="text-xs text-slate-500 mt-1">{safeData.max_consumption.user_name} ({safeData.max_consumption.user_email})</div>
                  </div>
                ) : (
                  <span className="text-slate-500" data-testid="overview-max-consumption">—</span>
                )}
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
