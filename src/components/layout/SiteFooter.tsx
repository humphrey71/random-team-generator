import React from 'react';
import { Link } from '@tanstack/react-router';
import { Container } from './Container';
import { Users, Shield, FileText } from 'lucide-react';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 pt-16 pb-12">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">RollSquad</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The fair, ultra-fast online random team generator and sports team draft simulator. Free, private, and zero installation required.
            </p>
          </div>

          {/* Core Tools Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Team Generators
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors text-slate-400">
                  Random Team Generator
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors text-slate-400">
                  Classroom Group Maker
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors text-slate-400">
                  Balanced Team Splitter
                </Link>
              </li>
            </ul>
          </div>

          {/* Sports Team Pickers (Network internal linking) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Sports League Pickers
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/random-nfl-team-generator"
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Random NFL Team Generator
                </Link>
              </li>
              <li>
                <Link
                  to="/random-nba-team-generator"
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Random NBA Team Generator
                </Link>
              </li>
              <li>
                <Link
                  to="/random-mlb-team-generator"
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Random MLB Team Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RollSquad (rollsquad.com). All rights reserved.</p>
          <p>Designed for fair team splits, fantasy drafts, and casual sports games.</p>
        </div>
      </Container>
    </footer>
  );
};
