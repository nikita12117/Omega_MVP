import React from 'react';
import { Shield, Mail, FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] border-t border-[#1e3a8a] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl font-bold text-[#06d6a0]">Ω Aurora Codex</div>
            </div>
            <p className="text-slate-400 text-sm">
              AI-powered prompt engineering platform built with modern privacy and security standards.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#06d6a0]" />
              Legal & Privacy
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/privacy" 
                  className="text-slate-400 hover:text-[#06d6a0] transition-colors"
                  data-testid="footer-privacy-link"
                >
                  Privacy Policy (GDPR)
                </a>
              </li>
              <li>
                <a 
                  href="/gdpr-settings" 
                  className="text-slate-400 hover:text-[#06d6a0] transition-colors"
                  data-testid="footer-gdpr-settings-link"
                >
                  GDPR Settings
                </a>
              </li>
              <li>
                <a 
                  href="/terms" 
                  className="text-slate-400 hover:text-[#06d6a0] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#06d6a0]" />
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="mailto:privacy@omega-aurora.info" 
                  className="text-slate-400 hover:text-[#06d6a0] transition-colors flex items-center gap-2"
                  data-testid="footer-privacy-email"
                >
                  <Shield className="h-3 w-3" />
                  privacy@omega-aurora.info
                </a>
              </li>
              <li>
                <span className="text-slate-400">Data Protection Officer (DPO)</span>
              </li>
              <li>
                <a 
                  href="mailto:support@omega-aurora.info" 
                  className="text-slate-400 hover:text-[#06d6a0] transition-colors"
                >
                  support@omega-aurora.info
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[#1e3a8a]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Omega-Aurora s.r.o. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-[#06d6a0]" />
              <span className="text-slate-400">GDPR Compliant</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">EU Regulation 2016/679</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;