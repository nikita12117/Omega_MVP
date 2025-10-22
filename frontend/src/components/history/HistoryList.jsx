import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

export default function HistoryList({ prompts, onSelectPrompt, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]" data-testid="history-loading">
        <Loader2 className="h-8 w-8 animate-spin text-[rgb(6,214,160)]" />
      </div>
    );
  }

  if (!prompts || prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center" data-testid="history-empty">
        <p className="text-slate-400 mb-2">Žádná historie</p>
        <p className="text-sm text-slate-500">Vygenerované prompty se zobrazí zde</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)]" data-testid="history-list">
      <div className="space-y-4 pr-4">
        {prompts.map((prompt, index) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card
              className="bg-[rgb(15,23,42)]/60 border-slate-800/50 hover:border-[rgb(6,214,160)]/30 transition-all duration-200 cursor-pointer group"
              onClick={() => onSelectPrompt(prompt)}
              data-testid={`history-item-${prompt.id}`}
            >
              <div className="p-6 space-y-4">
                {/* Name */}
                <h3 className="text-lg font-semibold text-[rgb(6,214,160)] group-hover:text-[rgb(6,214,160)]/90 transition-colors"
                    data-testid="history-item-name">
                  {prompt.name}
                </h3>

                {/* Description Card with 3 vertical sections */}
                <div className="bg-[rgb(10,15,29)]/40 border border-slate-800/30 rounded-lg p-4 space-y-3">
                  {/* Obecná funkce */}
                  <div data-testid="history-item-general">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                      Obecná funkce
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {prompt.description.general_function}
                    </p>
                  </div>

                  <Separator className="bg-slate-800/30" />

                  {/* Specializace */}
                  <div data-testid="history-item-specialization">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                      Specializace
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {prompt.description.specialization}
                    </p>
                  </div>

                  <Separator className="bg-slate-800/30" />

                  {/* Výstup */}
                  <div data-testid="history-item-output">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                      Výstup
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {prompt.description.output}
                    </p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-slate-500">
                  {new Date(prompt.created_at).toLocaleString('cs-CZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
