import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, Users, TrendingUp, Activity } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadOverview();
  }, []);
  
  const loadOverview = async () => {
    try {
      const response = await axios.get(`${API}/admin/overview`);
      setData(response.data);
    } catch (error) {
      console.error('Error loading overview:', error);
      toast.error('Failed to load overview data');
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
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">No data available</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <header className="relative p-6 border-b border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(6,214,160)]/5 to-transparent" />
        <div className="relative">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Přehled</h1>
          <p className="text-slate-400 text-sm mt-1">Klíčové metriky a spotřeba tokenů</p>
        </div>
      </header>
      
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <Card data-testid="overview-revenue-card" className="bg-[rgb(15,23,42)]/60 border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[rgb(6,214,160)]" />
              Celkové příjmy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-100">{data.total_revenue?.toLocaleString() || 0} Kč</div>
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
            <div className="text-3xl font-semibold text-slate-100">{data.active_users_24h || 0}</div>
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
            <div className="text-3xl font-semibold text-slate-100">{data.active_users_7d || 0}</div>
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
            <div className="text-3xl font-semibold text-slate-100">{Math.round(data.avg_tokens_per_agent || 0)}</div>
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
                <AreaChart data={data.token_history || []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                {data.min_consumption ? (
                  <div className="text-slate-100" data-testid="overview-min-consumption">
                    <div className="font-semibold text-[rgb(6,214,160)]">{data.min_consumption.tokens} tokenů</div>
                    <div className="text-xs text-slate-500 mt-1">{data.min_consumption.user_name} ({data.min_consumption.user_email})</div>
                  </div>
                ) : (
                  <span className="text-slate-500" data-testid="overview-min-consumption">—</span>
                )}
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-slate-400">Nejvyšší spotřeba:</span>
                {data.max_consumption ? (
                  <div className="text-slate-100" data-testid="overview-max-consumption">
                    <div className="font-semibold text-[rgb(138,43,226)]">{data.max_consumption.tokens} tokenů</div>
                    <div className="text-xs text-slate-500 mt-1">{data.max_consumption.user_name} ({data.max_consumption.user_email})</div>
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
