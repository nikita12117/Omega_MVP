import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Copy, Check, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

export default function HistoryDetail({ prompt, onBack, onUpdateName }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(prompt.name);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success('Zkopírováno do schránky');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveName = async () => {
    if (editedName.trim() && editedName !== prompt.name) {
      await onUpdateName(prompt.id, editedName.trim());
      setIsEditingName(false);
    } else {
      setIsEditingName(false);
      setEditedName(prompt.name);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName(prompt.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
      className="h-full flex flex-col"
      data-testid="history-detail"
    >
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-slate-400 hover:text-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/10"
          data-testid="history-detail-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zpět na seznam
        </Button>
      </div>

      <ScrollArea className="flex-1" data-testid="history-detail-content">
        <div className="space-y-6 pr-4">
          {/* Name Section */}
          <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Název agenta
              </h2>
              <div className="flex items-center gap-2">
                {!isEditingName && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingName(true)}
                      className="text-slate-400 hover:text-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/10"
                      data-testid="history-detail-edit-name"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(prompt.name, 'name')}
                      className="text-slate-400 hover:text-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/10"
                      data-testid="history-detail-copy-name"
                    >
                      {copiedField === 'name' ? (
                        <Check className="h-4 w-4 text-[rgb(6,214,160)]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-[rgb(10,15,29)] border-slate-700 focus:border-[rgb(6,214,160)] text-slate-100"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  data-testid="history-detail-name-input"
                />
                <Button
                  size="sm"
                  onClick={handleSaveName}
                  className="bg-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/90 text-slate-900"
                  data-testid="history-detail-save-name"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="text-slate-400 hover:text-slate-300"
                  data-testid="history-detail-cancel-name"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <h3 className="text-2xl font-bold text-[rgb(6,214,160)]" data-testid="history-detail-name-display">
                {prompt.name}
              </h3>
            )}
          </Card>

          {/* Description Section - 3 horizontal sections */}
          <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Popis agenta
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Obecná funkce */}
              <div className="space-y-2" data-testid="history-detail-general">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Obecná funkce
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(prompt.description.general_function, 'general')}
                    className="text-slate-400 hover:text-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/10 h-6 w-6 p-0"
                    data-testid="history-detail-copy-general"
                  >
                    {copiedField === 'general' ? (
                      <Check className="h-3 w-3 text-[rgb(6,214,160)]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {prompt.description.general_function}
                </p>
              </div>

              <Separator orientation="vertical" className="hidden md:block bg-slate-800/30" />

              {/* Specializace */}
              <div className="space-y-2" data-testid="history-detail-specialization">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Specializace
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(prompt.description.specialization, 'specialization')}
                    className="text-slate-400 hover:text-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/10 h-6 w-6 p-0"
                    data-testid="history-detail-copy-specialization"
                  >
                    {copiedField === 'specialization' ? (
                      <Check className="h-3 w-3 text-[rgb(6,214,160)]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {prompt.description.specialization}
                </p>
              </div>

              <Separator orientation="vertical" className="hidden md:block bg-slate-800/30" />

              {/* Výstup */}
              <div className="space-y-2" data-testid="history-detail-output">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Výstup
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(prompt.description.output, 'output')}
                    className="text-slate-400 hover:text-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/10 h-6 w-6 p-0"
                    data-testid="history-detail-copy-output"
                  >
                    {copiedField === 'output' ? (
                      <Check className="h-3 w-3 text-[rgb(6,214,160)]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {prompt.description.output}
                </p>
              </div>
            </div>
          </Card>

          {/* Master Prompt Section */}
          <Card className="bg-[rgb(15,23,42)]/60 border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Master Prompt
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(prompt.master_prompt, 'prompt')}
                className="text-slate-400 hover:text-[rgb(6,214,160)] hover:bg-[rgb(6,214,160)]/10"
                data-testid="history-detail-copy-prompt"
              >
                {copiedField === 'prompt' ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-[rgb(6,214,160)]" />
                    Zkopírováno
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Kopírovat
                  </>
                )}
              </Button>
            </div>
            <div 
              className="prose prose-invert prose-slate max-w-none
                        prose-headings:text-[rgb(6,214,160)] prose-headings:font-semibold
                        prose-p:text-slate-300 prose-p:leading-relaxed
                        prose-a:text-[rgb(6,214,160)] prose-a:no-underline hover:prose-a:underline
                        prose-code:text-[rgb(6,214,160)] prose-code:bg-[rgb(10,15,29)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                        prose-pre:bg-[rgb(10,15,29)] prose-pre:border prose-pre:border-slate-800
                        prose-strong:text-slate-200 prose-strong:font-semibold
                        prose-ul:text-slate-300 prose-ol:text-slate-300
                        prose-li:text-slate-300"
              data-testid="history-detail-prompt-content"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {prompt.master_prompt}
              </ReactMarkdown>
            </div>
          </Card>

          {/* Timestamp */}
          <div className="text-xs text-slate-500 text-center">
            Vytvořeno: {new Date(prompt.created_at).toLocaleString('cs-CZ', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
