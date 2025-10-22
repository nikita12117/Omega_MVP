import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';

const TemplatesDialog = ({ open, onOpenChange, onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/agent-templates');
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Chyba při načítání šablon');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onOpenChange(false);
    }
  };

  // Group templates by category
  const groupedTemplates = templates.reduce((acc, template) => {
    const category = template.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-[#10172a] border-[#25365a] text-[#e6f1ff]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#06d6a0]" />
            Vyberte šablonu agenta
          </DialogTitle>
          <DialogDescription className="text-[#9fb4d0]">
            Začněte s předpřipravenou šablonou pro rychlejší vytvoření agenta
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#06d6a0]" />
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-[#06d6a0] mb-3">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryTemplates.map((template) => (
                      <Card
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedTemplate?.id === template.id
                            ? 'bg-[#06d6a0]/10 border-[#06d6a0]'
                            : 'bg-[#0a0f1d] border-[#25365a] hover:border-[#06d6a0]/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{template.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#e6f1ff] mb-1">
                              {template.name}
                            </h4>
                            <p className="text-sm text-[#9fb4d0] mb-3">
                              {template.description}
                            </p>
                            <div className="space-y-1">
                              {template.example_use_cases.slice(0, 2).map((useCase, idx) => (
                                <div key={idx} className="text-xs text-[#9fb4d0] flex items-center gap-2">
                                  <span className="text-[#06d6a0]">→</span>
                                  {useCase}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-[#25365a]">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[#9fb4d0] hover:text-[#e6f1ff] hover:bg-[#25365a]"
          >
            Zrušit
          </Button>
          <Button
            onClick={handleUseTemplate}
            disabled={!selectedTemplate}
            className="bg-[#06d6a0] hover:bg-[#05c090] text-[#0a0f1d] disabled:opacity-50"
          >
            Použít šablonu
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesDialog;
