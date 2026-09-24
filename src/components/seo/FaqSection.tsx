import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ChevronDown, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  title = 'Frequently Asked Questions',
  subtitle = 'Find answers to common questions about fair team splitting and random sports generation.',
  items,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="mt-16 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-slate-600">
          {subtitle}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <Card
              key={idx}
              className="bg-white border-slate-200 overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-slate-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-sm sm:text-base text-slate-900">
                  {item.question}
                </span>
                <ChevronDown
                  className={clsx(
                    'w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180 text-brand-600'
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  <p>{item.answer}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
};
