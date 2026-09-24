import React from 'react';
import { Card } from '../ui/Card';

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface HowToSectionProps {
  title: string;
  subtitle: string;
  steps: StepItem[];
}

export const HowToSection: React.FC<HowToSectionProps> = ({
  title,
  subtitle,
  steps,
}) => {
  return (
    <section className="mt-16 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-slate-600">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map(step => (
          <Card key={step.number} className="p-6 bg-white border-slate-200 relative overflow-hidden">
            <span className="text-5xl font-black text-slate-100 absolute -top-2 -right-2 select-none pointer-events-none">
              {step.number}
            </span>
            <div className="relative z-10 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 font-extrabold text-sm flex items-center justify-center">
                {step.number}
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
