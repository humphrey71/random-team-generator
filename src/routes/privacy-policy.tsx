import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Container } from '../components/layout/Container';
import { Shield, ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container size="sm" className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: September 24, 2026
          </p>
        </div>

        <div className="prose prose-slate prose-sm max-w-none space-y-6 text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Commitment to Privacy</h2>
            <p>
              At RollSquad (rollsquad.com), we strongly believe that utility tools should respect user privacy. We do not require registration, accounts, or personal information to use our random team generators or sports team pickers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Local-Only Processing</h2>
            <p>
              Any names, participant lists, or custom inputs you provide into our team generator are processed solely within your browser memory (client-side execution). We do not transmit, log, or store your roster data on any external servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Analytics & Cookies</h2>
            <p>
              We may utilize privacy-friendly, anonymized traffic analytics to monitor website reliability and popular search paths. These services do not collect personally identifiable information (PII).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please reach out via our GitHub repository or project contact links.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
