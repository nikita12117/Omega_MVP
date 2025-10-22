import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { educationTexts } from '@/lib/education-texts';

const documents = [
  { id: 'omega-minus9-primordial', label: 'Ω⁻⁹ Primordial', testId: 'doc-selector-omega-minus9', pdfPrefix: 'Ω⁻⁹ singular metacontext logic-fields' },
  { id: 'omega-minus4-matrices', label: 'Ω⁻⁴ Matrices', testId: 'doc-selector-omega-minus4', pdfPrefix: 'Ω⁻⁴ The Silence Before Light' },
  { id: 'omega-infinity-framework', label: 'Ω∞ Framework', testId: 'doc-selector-omega-infinity', pdfPrefix: 'Ω∞ — the Open Field of Perpetual Genesis' }
];

const perspectives = [
  { id: 'child', label: 'Child 10+', testId: 'perspective-child', pdfSuffix: 'child' },
  { id: 'adult-notech', label: 'Adult Non-Tech', testId: 'perspective-nontech', pdfSuffix: 'adult_non_tech' },
  { id: 'adult-tech', label: 'Tech Pro', testId: 'perspective-tech', pdfSuffix: 'adult_tech' }
];

export default function Education() {
  const [selectedDoc, setSelectedDoc] = useState('omega-minus4-matrices');
  const [selectedPerspective, setSelectedPerspective] = useState('adult-notech');

  const currentText = educationTexts[selectedDoc]?.[selectedPerspective] || '';
  
  // Get PDF filename for current selection
  const getPdfFilename = () => {
    const doc = documents.find(d => d.id === selectedDoc);
    const persp = perspectives.find(p => p.id === selectedPerspective);
    if (!doc || !persp) return null;
    return `${doc.pdfPrefix}_${persp.pdfSuffix}.pdf`;
  };
  
  const handleDownloadPdf = () => {
    const filename = getPdfFilename();
    if (!filename) return;
    
    // Create link to PDF in /lib folder
    const link = document.createElement('a');
    link.href = `/lib/${filename}`;
    link.download = filename;
    link.click();
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
        <div className="grid lg:grid-cols-[340px,1fr] gap-6 lg:gap-8">
          {/* Left Sidebar - Selectors */}
          <aside className="space-y-8">
            {/* Document Selector */}
            <div>
              <h2 className="text-sm font-medium text-slate-300 mb-3 tracking-tight">Documents</h2>
              <div className="grid grid-cols-1 gap-2">
                {documents.map((doc) => (
                  <Button
                    key={doc.id}
                    data-testid={doc.testId}
                    onClick={() => setSelectedDoc(doc.id)}
                    variant="outline"
                    className={`justify-start text-left h-auto py-3 px-4 border transition-all duration-150 ${
                      selectedDoc === doc.id
                        ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] shadow-[var(--btn-shadow)]'
                        : 'border-[color:var(--border)] bg-transparent text-slate-200 hover:bg-white/5 hover:border-[hsl(var(--accent))]/50'
                    }`}
                  >
                    {doc.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-[color:var(--border)]" />

            {/* Perspective Selector */}
            <div>
              <h2 className="text-sm font-medium text-slate-300 mb-3 tracking-tight">Perspective</h2>
              <div className="grid grid-cols-1 gap-2">
                {perspectives.map((perspective) => (
                  <Button
                    key={perspective.id}
                    data-testid={perspective.testId}
                    onClick={() => setSelectedPerspective(perspective.id)}
                    variant="outline"
                    className={`justify-start text-left h-auto py-3 px-4 border transition-all duration-150 ${
                      selectedPerspective === perspective.id
                        ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] shadow-[var(--btn-shadow)]'
                        : 'border-[color:var(--border)] bg-transparent text-slate-200 hover:bg-white/5 hover:border-[hsl(var(--accent))]/50'
                    }`}
                  >
                    {perspective.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-[color:var(--border)]" />

            {/* Context Help */}
            <Card className="p-4 bg-[hsl(var(--card))] border-[color:var(--border)]">
              <p className="text-xs text-slate-400 leading-relaxed">
                Select a document and perspective to explore Omega prompt engineering concepts at different complexity levels.
              </p>
            </Card>
            
            {/* PDF Download Button - Last */}
            <Button
              onClick={handleDownloadPdf}
              data-testid="education-download-pdf"
              className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-slate-900 font-medium shadow-[var(--btn-shadow)] transition-all duration-150"
            >
              <Download className="h-4 w-4 mr-2" />
              Stáhnout PDF
            </Button>
          </aside>

          {/* Right Content Area */}
          <main>
            <Card className="bg-[hsl(var(--card))] border-[color:var(--border)] overflow-hidden">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-6 sm:p-8 lg:p-12">
                  <article 
                    data-testid="education-content"
                    className="prose prose-invert max-w-none
                      prose-headings:text-slate-100 prose-headings:font-semibold prose-headings:tracking-tight
                      prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:text-[hsl(var(--accent))]
                      prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-[color:var(--border)] prose-h2:pb-2
                      prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-4
                      prose-p:text-slate-200/90 prose-p:leading-7 prose-p:mb-4
                      prose-strong:text-slate-100 prose-strong:font-semibold
                      prose-em:text-slate-300 prose-em:italic
                      prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                      prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                      prose-li:text-slate-200/90 prose-li:my-2
                      prose-code:text-[hsl(var(--accent))] prose-code:bg-[hsl(var(--muted))] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                      prose-pre:bg-[hsl(219,47%,12%)] prose-pre:border prose-pre:border-[color:var(--border)] prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                      prose-blockquote:border-l-4 prose-blockquote:border-[hsl(var(--accent))] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-300
                      prose-table:border-collapse prose-table:w-full
                      prose-th:bg-[hsl(var(--muted))] prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-[color:var(--border)]
                      prose-td:p-3 prose-td:border prose-td:border-[color:var(--border)]
                      prose-a:text-[hsl(var(--accent))] prose-a:no-underline hover:prose-a:underline
                      prose-hr:border-[color:var(--border)] prose-hr:my-8
                    "
                    style={{ maxWidth: '70ch', lineHeight: '1.8' }}
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {currentText}
                    </ReactMarkdown>
                  </article>
                </div>
              </ScrollArea>
            </Card>
          </main>
        </div>
      </motion.div>
    </div>
  );
}