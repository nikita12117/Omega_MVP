import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { Users, Bot, Coins, RefreshCw, Activity } from 'lucide-react';

const LiveMonitor = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchMetrics = async () => {
    try {
      const response = await apiClient.get('/admin/metrics');
      setMetrics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      if (loading) {
        toast.error('Chyba při načítání metrik');
      }
      setLoading(false);
    }
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
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 px-2">
          <div>
            <h2 className="text-4xl font-bold text-[#e6f1ff] mb-3">Live Expo Monitor</h2>
            <p className="text-lg text-[#9fb4d0]">
              Real-time metriky aktivit | Obnoveno: {new Date().toLocaleTimeString('cs-CZ')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-[#06d6a0] text-[#0a0f1d] h-11' : 'border-[#25365a] text-[#9fb4d0] h-11'}
            >
              <Activity className="w-4 h-4 mr-2" />
              {autoRefresh ? 'Auto (30s)' : 'Manuální'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchMetrics}
              disabled={loading}
              className="border-[#25365a] text-[#9fb4d0] hover:text-[#e6f1ff] hover:border-[#06d6a0]/50 h-11 px-5"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {metrics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-[#10172a] border-[#1e3a8a] hover:border-[#1e3a8a]/80 transition-all">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#7a8fb8] font-medium mb-2">Aktivní Uživatelé</p>
                      <p className="text-5xl font-bold text-[#e6f1ff]">{metrics.active_users}</p>
                      <p className="text-xs text-[#7a8fb8] mt-2">Posledních 24 hodin</p>
                    </div>
                    <div className="w-16 h-16 bg-[#1e3a8a]/20 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-[#1e3a8a]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#10172a] border-[#06d6a0] hover:border-[#06d6a0]/80 transition-all">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#7a8fb8] font-medium mb-2">Agenti Dnes</p>
                      <p className="text-5xl font-bold text-[#06d6a0]">{metrics.agents_created_today}</p>
                      <p className="text-xs text-[#7a8fb8] mt-2">Vytvořeno</p>
                    </div>
                    <div className="w-16 h-16 bg-[#06d6a0]/10 rounded-full flex items-center justify-center">
                      <Bot className="w-8 h-8 text-[#06d6a0]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#10172a] border-[#9fb4d0] hover:border-[#9fb4d0]/80 transition-all">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#7a8fb8] font-medium mb-2">Token Usage</p>
                      <p className="text-5xl font-bold text-[#9fb4d0]">
                        {(metrics.token_consumption_24h / 1000).toFixed(1)}K
                      </p>
                      <p className="text-xs text-[#7a8fb8] mt-2">Posledních 24h</p>
                    </div>
                    <div className="w-16 h-16 bg-[#9fb4d0]/10 rounded-full flex items-center justify-center">
                      <Coins className="w-8 h-8 text-[#9fb4d0]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Keywords Word Frequency */}
            {metrics.top_keywords && metrics.top_keywords.length > 0 && (
              <Card className="bg-[#10172a] border-[#25365a]">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl text-[#e6f1ff]">Trending Keywords (7 dní)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                    {metrics.top_keywords.map((item, idx) => (
                      <div 
                        key={idx}
                        className="border-2 border-[#25365a] rounded-lg p-6 text-center hover:border-[#06d6a0]/50 transition-all"
                      >
                        <div className="text-3xl font-bold text-[#e6f1ff] mb-2">{item.count}</div>
                        <div className="text-sm text-[#9fb4d0]">{item.keyword}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity Indicator */}
            <Card className="bg-gradient-to-r from-[#06d6a0]/20 to-[#1e3a8a]/20 border-[#06d6a0]">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#e6f1ff] mb-1">System Status</h3>
                    <p className="text-base text-[#9fb4d0]">Všechny služby běží normálně</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#06d6a0] rounded-full animate-pulse"></div>
                    <span className="text-base font-medium text-[#06d6a0]">LIVE</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveMonitor;