import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Users, Trophy, Menu, X, Share2, Check } from 'lucide-react';
import { Container } from './Container';

export const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const cleanUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://teamgenerator.org/';

    const shareData = {
      title: 'Random Team Generator - Fair & Fast Group Maker',
      text: 'Easily split any list of names into balanced, randomized teams in seconds!',
      url: cleanUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or failed, fallback to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(cleanUrl);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // fallback
      }
    }
  };

  const navItems = [
    { label: 'Team Divider', to: '/', icon: Users },
    { label: 'NFL Team Picker', to: '/random-nfl-team-generator', icon: Trophy },
    { label: 'NBA Team Picker', to: '/random-nba-team-generator', icon: Trophy },
    { label: 'MLB Team Picker', to: '/random-mlb-team-generator', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <Container size="lg">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.svg" alt="TeamGenerator.org" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 [&.active]:text-brand-600 [&.active]:bg-brand-50"
              >
                <item.icon className="w-4 h-4 text-slate-400 group-hover:text-brand-500" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-100/80 hover:bg-brand-50 border border-slate-200/80 hover:border-brand-300 rounded-lg transition-all"
              title="Share this tool"
            >
              {shared ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg [&.active]:text-brand-600 [&.active]:bg-brand-50"
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </header>
  );
};
