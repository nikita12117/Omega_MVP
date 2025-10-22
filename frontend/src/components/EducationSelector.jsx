import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { educationTexts, documentNames, perspectives } from '../data/educationTexts';

export const EducationSelector = () => {
  const docs = ['omega-minus9-primordial', 'omega-minus4-matrices', 'omega-infinity-framework'];
  const perspectiveKeys = ['child', 'adult-notech', 'adult-tech'];
  
  const [selectedDoc, setSelectedDoc] = useState(docs[0]);
  const [selectedPerspective, setSelectedPerspective] = useState(perspectiveKeys[0]);

  const getCurrentContent = () => {
    return educationTexts[selectedDoc]?.[selectedPerspective] || 'Content not available.';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Left sidebar - Document and Perspective Selection */}
      <div className="lg:col-span-4 space-y-6">
        {/* Document Tabs */}
        <Card className="p-4 bg-surface border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Select Document</h3>
          <Tabs value={selectedDoc} onValueChange={setSelectedDoc} className="w-full">
            <TabsList className="grid grid-cols-1 gap-2 h-auto bg-transparent">
              {docs.map((doc, idx) => (
                <TabsTrigger
                  key={doc}
                  value={doc}
                  data-testid={`education-doc-tab-${doc}`}
                  className="justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs">
                      {idx + 1}
                    </Badge>
                    <span className="text-left">{documentNames[doc]}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </Card>

        {/* Perspective Pills */}
        <Card className="p-4 bg-surface border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Select Perspective</h3>
          <div className="flex flex-col gap-2">
            {perspectiveKeys.map((perspKey) => (
              <Button
                key={perspKey}
                onClick={() => setSelectedPerspective(perspKey)}
                data-testid={`education-perspective-${perspKey}-button`}
                variant={selectedPerspective === perspKey ? 'default' : 'outline'}
                className="justify-start h-auto py-3 px-4"
              >
                {perspectives[perspKey]}
              </Button>
            ))}
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-4 bg-surface-2 border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
              <p className="text-xs text-muted-foreground">
                Currently viewing: <span className="text-accent font-medium">{documentNames[selectedDoc]}</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Perspective: <span className="text-accent font-medium">{perspectives[selectedPerspective]}</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Right pane - Content Reader */}
      <Card
        className="lg:col-span-8 bg-surface border-border"
        data-testid="education-content-pane"
      >
        <div className="p-6 sm:p-8">
          <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
            <AnimatePresence mode="wait">
              <motion.article
                key={`${selectedDoc}-${selectedPerspective}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="prose prose-invert max-w-none"
              >
                <div className="whitespace-pre-wrap leading-7 text-base md:text-lg text-muted-foreground">
                  {getCurrentContent()}
                </div>
              </motion.article>
            </AnimatePresence>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};

export default EducationSelector;