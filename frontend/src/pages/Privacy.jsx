import React, { useState } from 'react';
import { Shield, Mail, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  const [language, setLanguage] = useState('cz');
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[#06d6a0]/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-[#06d6a0]" />
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            {language === 'cz' ? 'Zásady ochrany osobních údajů' : 'Privacy Policy'}
          </h1>
          <p className="text-slate-400">
            {language === 'cz' 
              ? 'Platné dle GDPR (nařízení EU 2016/679)'
              : 'Compliant with GDPR (EU Regulation 2016/679)'}
          </p>
          
          {/* Language Toggle */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant={language === 'cz' ? 'default' : 'outline'}
              onClick={() => setLanguage('cz')}
              className={language === 'cz' ? 'bg-[#06d6a0] text-[#0a0f1d]' : 'border-[#1e3a8a] text-slate-300'}
              data-testid="language-cz"
            >
              Česky
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => setLanguage('en')}
              className={language === 'en' ? 'bg-[#06d6a0] text-[#0a0f1d]' : 'border-[#1e3a8a] text-slate-300'}
              data-testid="language-en"
            >
              English
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#0f172a] border border-[#1e3a8a] rounded-lg p-8 space-y-6">
          {language === 'cz' ? (
            <>
              {/* Controller Info */}
              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-100">Správce údajů</h2>
                <div className="text-slate-300 space-y-2">
                  <p><strong>Omega-Aurora s.r.o.</strong></p>
                  <p>IČO: [doplňte]</p>
                  <p>Sídlo: [doplňte]</p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#06d6a0]" />
                    <a href="mailto:privacy@quantum-codex.com" className="text-[#06d6a0] hover:underline">
                      privacy@quantum-codex.com
                    </a>
                  </p>
                </div>
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              {/* Purposes */}
              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('purposes')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                  data-testid="section-purposes"
                >
                  <span>Účely zpracování</span>
                  {expandedSection === 'purposes' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'purposes' && (
                  <ul className="text-slate-300 space-y-2 list-disc list-inside">
                    <li>Registrace a správa uživatelského účtu</li>
                    <li>Správa tokenů a transakcí</li>
                    <li>Generování promptů a historie</li>
                    <li>Analytika a metriky</li>
                    <li>Marketing (newsletter, pouze opt-in)</li>
                    <li>Administrace platformy</li>
                  </ul>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              {/* Categories */}
              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('categories')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                  data-testid="section-categories"
                >
                  <span>Kategorie osobních údajů</span>
                  {expandedSection === 'categories' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'categories' && (
                  <ul className="text-slate-300 space-y-2 list-disc list-inside">
                    <li>E-mail, jméno, avatar, ID</li>
                    <li>Transakce, zůstatek tokenů, aktivita</li>
                    <li>Text promptů, historie generování</li>
                  </ul>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              {/* Legal Bases */}
              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('legal')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                  data-testid="section-legal"
                >
                  <span>Právní základy zpracování</span>
                  {expandedSection === 'legal' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'legal' && (
                  <ul className="text-slate-300 space-y-2 list-disc list-inside">
                    <li><strong>Plnění smlouvy</strong> (Čl. 6 odst. 1 písm. b) GDPR) - pro správu účtu a poskytování služby</li>
                    <li><strong>Souhlas</strong> (Čl. 6 odst. 1 písm. a) GDPR) - pro marketing a analytiku</li>
                    <li><strong>Oprávněný zájem</strong> (Čl. 6 odst. 1 písm. f) GDPR) - pro analýzu a zlepšení služby</li>
                  </ul>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              {/* Recipients */}
              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('recipients')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                  data-testid="section-recipients"
                >
                  <span>Příjemci a přenosy dat</span>
                  {expandedSection === 'recipients' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'recipients' && (
                  <div className="text-slate-300 space-y-2">
                    <p><strong>Procesory:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Google (OAuth autentizace)</li>
                      <li>OpenAI (generování promptů)</li>
                      <li>Cloud hosting</li>
                    </ul>
                    <p className="mt-3"><strong>Přenos mimo EHP:</strong> Pouze OpenAI (USA) - zajištěno standardními smluvními doložkami (SCC)</p>
                  </div>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              {/* Retention */}
              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('retention')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                  data-testid="section-retention"
                >
                  <span>Doba uchování</span>
                  {expandedSection === 'retention' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'retention' && (
                  <ul className="text-slate-300 space-y-2 list-disc list-inside">
                    <li>Údaje účtu: Po dobu trvání účtu</li>
                    <li>Transakce: 7 let (účetní povinnost)</li>
                    <li>Marketing: Do odvolání souhlasu</li>
                    <li>Historie promptů: 2 roky od vytvoření</li>
                  </ul>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              {/* Rights */}
              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('rights')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                  data-testid="section-rights"
                >
                  <span>Vaše práva</span>
                  {expandedSection === 'rights' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'rights' && (
                  <div className="text-slate-300 space-y-2">
                    <p>Podle GDPR máte následující práva:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Právo na přístup</strong> (Čl. 15) - získat kopii svých údajů</li>
                      <li><strong>Právo na opravu</strong> (Čl. 16) - opravit nesprávné údaje</li>
                      <li><strong>Právo na výmaz</strong> (Čl. 17) - "právo být zapomenut"</li>
                      <li><strong>Právo na omezení zpracování</strong> (Čl. 18)</li>
                      <li><strong>Právo na přenositelnost</strong> (Čl. 20) - získat data v strojově čitelném formátu</li>
                      <li><strong>Právo vznést námitku</strong> (Čl. 21) - proti zpracování na základě oprávněného zájmu</li>
                      <li><strong>Právo podat stížnost</strong> - u Úřadu pro ochranu osobních údajů (ÚOOÚ)</li>
                    </ul>
                    <p className="mt-4">
                      Pro uplatnění práv nás kontaktujte na{' '}
                      <a href="mailto:privacy@quantum-codex.com" className="text-[#06d6a0] hover:underline">
                        privacy@quantum-codex.com
                      </a>
                      {' '}nebo použijte <a href="/gdpr-settings" className="text-[#06d6a0] hover:underline">GDPR nastavení</a> ve svém účtu.
                    </p>
                  </div>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              {/* Automated Decision Making */}
              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-100">Automatizované rozhodování</h2>
                <p className="text-slate-300">
                  Neprovádíme automatizované rozhodování ani profilování, které by mělo právní nebo významný dopad na uživatele.
                </p>
              </section>
            </>
          ) : (
            <>
              {/* English Version */}
              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-100">Data Controller</h2>
                <div className="text-slate-300 space-y-2">
                  <p><strong>Omega-Aurora s.r.o.</strong></p>
                  <p>Company ID: [fill in]</p>
                  <p>Registered office: [fill in]</p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#06d6a0]" />
                    <a href="mailto:privacy@quantum-codex.com" className="text-[#06d6a0] hover:underline">
                      privacy@quantum-codex.com
                    </a>
                  </p>
                </div>
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('purposes')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                >
                  <span>Purposes of Processing</span>
                  {expandedSection === 'purposes' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'purposes' && (
                  <ul className="text-slate-300 space-y-2 list-disc list-inside">
                    <li>User account registration and management</li>
                    <li>Token and transaction management</li>
                    <li>Prompt generation and history</li>
                    <li>Analytics and metrics</li>
                    <li>Marketing (newsletter, opt-in only)</li>
                    <li>Platform administration</li>
                  </ul>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('categories')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                >
                  <span>Categories of Personal Data</span>
                  {expandedSection === 'categories' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'categories' && (
                  <ul className="text-slate-300 space-y-2 list-disc list-inside">
                    <li>Email, name, avatar, ID</li>
                    <li>Transactions, token balance, activity</li>
                    <li>Prompt text, generation history</li>
                  </ul>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('legal')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                >
                  <span>Lawful Bases for Processing</span>
                  {expandedSection === 'legal' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'legal' && (
                  <ul className="text-slate-300 space-y-2 list-disc list-inside">
                    <li><strong>Contract performance</strong> (Art. 6(1)(b) GDPR) - for account management and service provision</li>
                    <li><strong>Consent</strong> (Art. 6(1)(a) GDPR) - for marketing and analytics</li>
                    <li><strong>Legitimate interest</strong> (Art. 6(1)(f) GDPR) - for analysis and service improvement</li>
                  </ul>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('recipients')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                >
                  <span>Recipients and Data Transfers</span>
                  {expandedSection === 'recipients' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'recipients' && (
                  <div className="text-slate-300 space-y-2">
                    <p><strong>Processors:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Google (OAuth authentication)</li>
                      <li>OpenAI (prompt generation)</li>
                      <li>Cloud hosting</li>
                    </ul>
                    <p className="mt-3"><strong>Transfers outside EEA:</strong> OpenAI only (USA) - secured by Standard Contractual Clauses (SCC)</p>
                  </div>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('retention')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                >
                  <span>Retention Periods</span>
                  {expandedSection === 'retention' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'retention' && (
                  <ul className="text-slate-300 space-y-2 list-disc list-inside">
                    <li>Account data: For the duration of the account</li>
                    <li>Transactions: 7 years (accounting obligation)</li>
                    <li>Marketing: Until consent is withdrawn</li>
                    <li>Prompt history: 2 years from creation</li>
                  </ul>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              <section className="space-y-3">
                <button
                  onClick={() => toggleSection('rights')}
                  className="w-full flex items-center justify-between text-2xl font-semibold text-slate-100 hover:text-[#06d6a0] transition-colors"
                >
                  <span>Your Rights</span>
                  {expandedSection === 'rights' ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSection === 'rights' && (
                  <div className="text-slate-300 space-y-2">
                    <p>Under GDPR, you have the following rights:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Right to access</strong> (Art. 15) - obtain a copy of your data</li>
                      <li><strong>Right to rectification</strong> (Art. 16) - correct inaccurate data</li>
                      <li><strong>Right to erasure</strong> (Art. 17) - "right to be forgotten"</li>
                      <li><strong>Right to restriction of processing</strong> (Art. 18)</li>
                      <li><strong>Right to data portability</strong> (Art. 20) - receive data in machine-readable format</li>
                      <li><strong>Right to object</strong> (Art. 21) - to processing based on legitimate interest</li>
                      <li><strong>Right to lodge a complaint</strong> - with your Data Protection Authority</li>
                    </ul>
                    <p className="mt-4">
                      To exercise your rights, contact us at{' '}
                      <a href="mailto:privacy@quantum-codex.com" className="text-[#06d6a0] hover:underline">
                        privacy@quantum-codex.com
                      </a>
                      {' '}or use the <a href="/gdpr-settings" className="text-[#06d6a0] hover:underline">GDPR settings</a> in your account.
                    </p>
                  </div>
                )}
              </section>

              <div className="border-t border-[#1e3a8a]"></div>

              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-100">Automated Decision-Making</h2>
                <p className="text-slate-300">
                  We do not perform automated decision-making or profiling that would have legal or significant effects on users.
                </p>
              </section>
            </>
          )}

          {/* Contact Info */}
          <div className="mt-8 p-4 bg-[#06d6a0]/10 border border-[#06d6a0]/30 rounded-lg">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-[#06d6a0] mt-1" />
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">
                  {language === 'cz' ? 'Kontakt na DPO' : 'DPO Contact'}
                </h3>
                <p className="text-slate-300 text-sm">
                  {language === 'cz' 
                    ? 'Pro dotazy týkající se ochrany osobních údajů nás kontaktujte:'
                    : 'For privacy-related inquiries, contact us:'}
                </p>
                <a 
                  href="mailto:privacy@quantum-codex.com" 
                  className="text-[#06d6a0] hover:underline font-medium"
                >
                  privacy@quantum-codex.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;