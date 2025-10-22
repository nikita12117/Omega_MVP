import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { Lightbulb, TrendingUp, Brain, Sparkles } from 'lucide-react';

const MetaInsights = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/learning-summaries');
      setSummaries(response.data.summaries || []);
    } catch (error) {
      console.error('Error fetching summaries:', error);
      toast.error('Chyba při načítání insights');
    } finally {
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

  // Group by patterns
  const allPatterns = summaries.flatMap(s => s.patterns_extracted || []);
  const patternCounts = {};
  allPatterns.forEach(pattern => {
    patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
  });
  const topPatterns = Object.entries(patternCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="mb-12 px-2">
          <h2 className="text-4xl font-bold text-[#e6f1ff] mb-3">Meta-Insight Panel</h2>
          <p className="text-lg text-[#9fb4d0]">
            AI-generované poznatky o systémovém učení a emergentních vzorech
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7a8fb8] mb-2">Learning Cycles</p>
                  <p className="text-5xl font-bold text-[#e6f1ff]">{summaries.length}</p>
                </div>
                <div className="w-16 h-16 bg-[#9fb4d0]/10 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-[#9fb4d0]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7a8fb8] mb-2">Unique Patterns</p>
                  <p className="text-5xl font-bold text-[#06d6a0]">{Object.keys(patternCounts).length}</p>
                </div>
                <div className="w-16 h-16 bg-[#06d6a0]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-[#06d6a0]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7a8fb8] mb-2">Total Insights</p>
                  <p className="text-5xl font-bold text-[#1e3a8a]">{allPatterns.length}</p>
                </div>
                <div className="w-16 h-16 bg-[#1e3a8a]/20 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-[#1e3a8a]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Recurring Patterns */}
        {topPatterns.length > 0 && (
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl text-[#e6f1ff]">
                <Sparkles className="w-6 h-6 text-[#f59e0b]" />
                Nejčastější Emergentní Vzory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPatterns.map(([pattern, count], idx) => (
                  <div key={idx} className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06d6a0] to-[#1e3a8a] flex items-center justify-center text-white font-bold text-lg">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-lg text-[#e6f1ff]">{pattern}</span>
                        <Badge className="bg-[#1e3a8a] text-[#e6f1ff]">{count}× pozorováno</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Insights */}
        <Card className="bg-[#10172a] border-[#25365a]">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-[#e6f1ff]">Denní AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {summaries.length === 0 ? (
              <div className="text-center p-12 text-[#7a8fb8] text-lg">
                Zatím žádné insights k zobrazení
              </div>
            ) : (
              <div className="space-y-8">
                {summaries.map(summary => (
                  <div key={summary.date} className="border-l-4 border-[#06d6a0] pl-6 py-3">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-xl text-[#e6f1ff]">{summary.date}</h4>
                      <Badge className={summary.approved ? 'bg-[#06d6a0] text-[#0a0f1d]' : 'bg-[#7a8fb8] text-[#0a0f1d]'}>
                        {summary.approved ? 'Schváleno' : 'Čeká'}
                      </Badge>
                    </div>
                    
                    {summary.daily_insight && (
                      <div className="bg-gradient-to-r from-[#06d6a0]/10 to-transparent p-5 rounded-lg mb-4 border border-[#06d6a0]/30">
                        <div className="flex items-start gap-3">
                          <Brain className="w-6 h-6 text-[#06d6a0] mt-0.5 flex-shrink-0" />
                          <p className="text-base text-[#e6f1ff] italic leading-relaxed">
                            {summary.daily_insight}
                          </p>
                        </div>
                      </div>
                    )}

                    <p className="text-base text-[#9fb4d0] mb-4 leading-relaxed">{summary.summary_text}</p>
                    
                    {summary.patterns_extracted && summary.patterns_extracted.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {summary.patterns_extracted.map((pattern, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-[#25365a] text-[#9fb4d0]">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {summary.tokens_used && (
                      <div className="mt-4 text-sm text-[#7a8fb8]">
                        Analýza: {summary.tokens_used.total.toLocaleString()} tokenů
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetaInsights;