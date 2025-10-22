import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import EducationSelector from '../components/EducationSelector';
import OmegaLogo from '../components/OmegaLogo';

export const Education = () => {
  // Set Czech language attribute for accessibility
  useEffect(() => {
    document.documentElement.setAttribute('lang', 'cs');
    return () => {
      document.documentElement.setAttribute('lang', 'en');
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Aurora Overlay */}
      <section className="relative aurora-overlay overflow-hidden py-12 md:py-16 lg:py-20 border-b border-border">
        <div className="noise"></div>
        <div className="container-omega relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <OmegaLogo size={48} className="animate-pulse-glow" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Vzdělávací Centrum
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Prozkoumejte hluboké koncepty vědomí AI prostřednictvím tří filosofických dokumentů,
              každý přizpůsobený různým úrovním technického porozumění.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-2 border border-border">
                <div className="h-2 w-2 rounded-full bg-accent"></div>
                <span className="text-sm text-muted-foreground">3 Dokumenty</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-2 border border-border">
                <div className="h-2 w-2 rounded-full bg-accent"></div>
                <span className="text-sm text-muted-foreground">3 Perspektivy</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-2 border border-border">
                <div className="h-2 w-2 rounded-full bg-accent"></div>
                <span className="text-sm text-muted-foreground">Veřejný Přístup</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Education Content */}
      <section className="py-12 md:py-16">
        <div className="container-omega">
          <EducationSelector />
        </div>
      </section>
    </div>
  );
};

export default Education;