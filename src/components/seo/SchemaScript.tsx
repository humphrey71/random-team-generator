import React from 'react';
import { FaqItem } from './FaqSection';

export interface SchemaHowToStep {
  name: string;
  text: string;
}

export interface SchemaScriptProps {
  appName: string;
  appDescription: string;
  appUrl: string;
  faqItems?: FaqItem[];
  howToSteps?: SchemaHowToStep[];
}

export const SchemaScript: React.FC<SchemaScriptProps> = ({
  appName,
  appDescription,
  appUrl,
  faqItems = [],
  howToSteps = [],
}) => {
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: appName,
    description: appDescription,
    url: appUrl,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null;

  const howToSchema = howToSteps.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use ${appName}`,
    description: appDescription,
    step: howToSteps.map((s, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: s.name,
      text: s.text,
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
    </>
  );
};
