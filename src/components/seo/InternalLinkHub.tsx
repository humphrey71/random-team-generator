import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card } from '../ui/Card';
import { Users, Trophy } from 'lucide-react';

export const InternalLinkHub: React.FC = () => {
  const links = [
    {
      to: '/',
      title: 'Random Team Generator',
      desc: 'Divide any list of custom names into balanced, randomized teams.',
      icon: Users,
      badge: 'Core Tool',
    },
    {
      to: '/random-nfl-team-generator',
      title: 'Random NFL Team Generator',
      desc: 'Pick an NFL football franchise or shuffle your fantasy football draft order.',
      icon: Trophy,
      badge: '32 Teams',
    },
    {
      to: '/random-nba-team-generator',
      title: 'Random NBA Team Generator',
      desc: 'Draw an NBA basketball team or generate 2K draft lottery rankings.',
      icon: Trophy,
      badge: '30 Teams',
    },
    {
      to: '/random-mlb-team-generator',
      title: 'Random MLB Team Generator',
      desc: 'Spin for a Major League Baseball club with American & National league filters.',
      icon: Trophy,
      badge: '30 Teams',
    },
  ];

  return (
    <section className="mt-16 space-y-6 pt-10 border-t border-slate-200">
      <div className="text-center max-w-2xl mx-auto space-y-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2xl">
          Explore Free Random Generators & Pickers
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Discover our full suite of fast, privacy-focused online group dividers and sports selectors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className="group block">
              <Card hoverEffect className="p-4 bg-white border-slate-200 h-full flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
