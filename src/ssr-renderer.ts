import React from 'react';
import { renderToString } from 'react-dom/server';
import { createRouter, createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export interface RouteMeta {
  title: string;
  description: string;
}

export const ROUTE_METAS: Record<string, RouteMeta> = {
  '/': {
    title: 'Random Team Generator - Fair & Fast Group Divider',
    description: 'Quickly split names into fair, balanced teams with our free random team generator. Perfect for sports, classroom projects, trivia, and corporate icebreakers.',
  },
  '/random-nfl-team-generator': {
    title: 'Random NFL Team Generator - 32 Football Teams Picker',
    description: 'Pick a random NFL team from all 32 franchises. Generate fair fantasy football draft orders, eliminate picked teams, and filter by conference with ease.',
  },
  '/random-nba-team-generator': {
    title: 'Random NBA Team Generator - 30 Basketball Teams Picker',
    description: 'Randomly select an NBA basketball team from 30 franchises. Perfect for NBA 2K matches, fantasy draft lottery orders, and friendly sports debates.',
  },
  '/random-mlb-team-generator': {
    title: 'Random MLB Team Generator - 30 Baseball Teams Picker',
    description: 'Draw a random Major League Baseball team from all 30 clubs. Filter by AL or NL, shuffle draft positions, and challenge friends to random match-ups.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy - TeamGenerator Free Online Utility',
    description: 'Read the privacy policy of TeamGenerator.org. We respect user privacy with 100% client-side data execution and zero roster storage.',
  },
  '/terms': {
    title: 'Terms of Service - TeamGenerator Online Group Maker',
    description: 'Review the terms and conditions for using TeamGenerator.org random team generator tools, sports team pickers, and tournament utilities.',
  },
};

export async function renderPage(url: string): Promise<{ html: string; meta: RouteMeta }> {
  const memoryHistory = createMemoryHistory({ initialEntries: [url] });
  const router = createRouter({ routeTree, history: memoryHistory });
  await router.load();

  const html = renderToString(React.createElement(RouterProvider, { router }));
  const meta = ROUTE_METAS[url] || ROUTE_METAS['/'];

  return { html, meta };
}
