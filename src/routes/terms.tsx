import { createFileRoute, Link } from '@tanstack/react-router';
import { Container } from '../components/layout/Container';
import { FileText, ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
});

function TermsPage() {
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
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: September 24, 2026
          </p>
        </div>

        <div className="prose prose-slate prose-sm max-w-none space-y-6 text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using TeamGenerator (teamgenerator.org), you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Free Utility Service</h2>
            <p>
              TeamGenerator is provided on an "as is" and "as available" basis for personal, educational, recreational, and organizational use. We do not guarantee continuous or uninterrupted operation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Non-Affiliation Disclaimer</h2>
            <p>
              NFL, NBA, MLB and their respective logos, team names, and brand marks are registered trademarks of their respective leagues and franchises. RollSquad is an independent fan resource and is not endorsed by, sponsored by, or affiliated with any professional sports league.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Limitation of Liability</h2>
            <p>
              In no event shall RollSquad be liable for any direct or indirect damages arising out of the use or inability to use this website.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
