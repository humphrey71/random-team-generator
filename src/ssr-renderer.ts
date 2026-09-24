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
    title: 'Random Team Generator — Split Names into Balanced Teams & Groups',
    description: 'Free and fast random team generator. Paste your list of names and instantly split them into balanced groups by team count or group size. Perfect for classrooms, sports, and games.',
  },
  '/random-nfl-team-generator': {
    title: 'Random NFL Team Generator — Pick a Football Team & Draft Order',
    description: 'Randomly generate an NFL football team from all 32 franchises. Filter by AFC or NFC, shuffle fantasy draft orders, and spin for your next team.',
  },
  '/random-nba-team-generator': {
    title: 'Random NBA Team Generator — Basketball Team Picker & Draft Shuffle',
    description: 'Pick a random NBA basketball team from all 30 franchises. Filter by Eastern and Western Conference, generate draft orders, and pick teams instantly.',
  },
  '/random-mlb-team-generator': {
    title: 'Random MLB Team Generator — Baseball Team Picker & Order Generator',
    description: 'Generate a random Major League Baseball team from all 30 clubs. Filter by AL or NL, shuffle team lists, and make fair picks.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy — RollSquad',
    description: 'Privacy policy for RollSquad random team generator and sports pickers.',
  },
  '/terms': {
    title: 'Terms of Service — RollSquad',
    description: 'Terms of service for RollSquad random team generator and sports pickers.',
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
