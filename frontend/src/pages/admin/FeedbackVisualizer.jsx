import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { TrendingUp, MessageSquare, Hash } from 'lucide-react';

const FeedbackVisualizer = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/feedback/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching feedback analytics:', error);
      toast.error('Chyba při načítání analytiky');
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

  if (!analytics) {
    return (
      <div className="text-center p-12 text-[#7a8fb8] text-lg">
        Žádná data k zobrazení
      </div>
    );
  }

  const ratingColors = {
    1: 'bg-[#ef4444]',
    2: 'bg-[#f59e0b]',
    3: 'bg-[#f59e0b]',
    4: 'bg-[#06d6a0]',
    5: 'bg-[#06d6a0]'
  };

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="mb-12 px-2">
          <h2 className="text-4xl font-bold text-[#e6f1ff] mb-3">Feedback Visualizer</h2>
          <p className="text-lg text-[#9fb4d0]">
            Sentiment analýza a trendy uživatelské zpětné vazby
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7a8fb8] mb-2">Celkem Feedbacků</p>
                  <p className="text-5xl font-bold text-[#e6f1ff]">{analytics.total_feedbacks}</p>
                </div>
                <div className="w-16 h-16 bg-[#1e3a8a]/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-[#1e3a8a]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#10172a] border-[#25365a]">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7a8fb8] mb-2">Průměrné Hodnocení</p>
                  <p className="text-5xl font-bold text-[#06d6a0]">{analytics.average_rating} ★</p>
                </div>
                <div className="w-16 h-16 bg-[#06d6a0]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-[#06d6a0]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="bg-[#10172a] border-[#25365a]">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-[#e6f1ff]">Distribuce Hodnocení</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = analytics.rating_distribution[rating] || 0;
                const percentage = analytics.total_feedbacks > 0 
                  ? (count / analytics.total_feedbacks) * 100 
                  : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-6">
                    <div className="w-24 flex items-center gap-3">
                      <span className="font-medium text-lg text-[#e6f1ff]">{rating}</span>
                      <span className="text-[#f59e0b] text-xl">★</span>
                    </div>
                    <div className="flex-1 bg-[#0f1b33] rounded-full h-8 overflow-hidden border border-[#25365a]">
                      <div 
                        className={`h-full ${ratingColors[rating]} transition-all duration-500 flex items-center justify-end px-4`}
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 10 && (
                          <span className="text-white text-sm font-medium">
                            {percentage.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-20 text-base text-[#9fb4d0] text-right font-medium">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Daily Trends */}
        {analytics.daily_trends && analytics.daily_trends.length > 0 && (
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-[#e6f1ff]">Denní Trendy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.daily_trends.slice(-14).map(day => (
                  <div key={day.date} className="flex items-center gap-6">
                    <div className="w-32 text-base text-[#9fb4d0]">
                      {new Date(day.date).toLocaleDateString('cs-CZ')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-[#0f1b33] rounded-full h-5 overflow-hidden border border-[#25365a]">
                          <div 
                            className="h-full bg-gradient-to-r from-[#06d6a0]/70 to-[#06d6a0] transition-all"
                            style={{ width: `${(day.average_rating / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-base font-medium text-[#e6f1ff] w-16 text-right">
                          {day.average_rating.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Keywords - Word Cloud Style */}
        {analytics.top_keywords && analytics.top_keywords.length > 0 && (
          <Card className="bg-[#10172a] border-[#25365a]">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl text-[#e6f1ff]">
                <Hash className="w-6 h-6" />
                Nejčastější Klíčová Slova
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {analytics.top_keywords.map((item, idx) => {
                  const size = Math.min(1 + (item.count / analytics.top_keywords[0].count) * 1.5, 2.5);
                  return (
                    <Badge 
                      key={idx} 
                      variant="outline"
                      className="transition-transform hover:scale-110 cursor-default border-[#25365a] text-[#e6f1ff] hover:border-[#06d6a0]/50"
                      style={{ 
                        fontSize: `${size * 0.85}rem`,
                        padding: `${size * 0.35}rem ${size * 0.65}rem`
                      }}
                    >
                      {item.keyword}
                      <span className="ml-2 text-xs opacity-70">({item.count})</span>
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeedbackVisualizer;