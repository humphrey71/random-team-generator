import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Users, Trophy, Menu, X } from 'lucide-react';
import { Container } from './Container';

export const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight block leading-tight">
                RollSquad
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block">
                Random Team Generator
              </span>
            </div>
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
