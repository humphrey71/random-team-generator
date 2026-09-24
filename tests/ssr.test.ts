import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createRouter, createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '../src/routeTree.gen';

describe('SSR Prerender capability', () => {
  it('should render homepage to HTML containing initial 10-person 2-team cards and SEO content', async () => {
    const memoryHistory = createMemoryHistory({ initialEntries: ['/'] });
    const router = createRouter({ routeTree, history: memoryHistory });
    await router.load();

    const html = renderToString(React.createElement(RouterProvider, { router }));

    expect(html).toContain('Random Team Generator');
    expect(html).toContain('Team 1');
    expect(html).toContain('Team 2');
    expect(html).toContain('Alex');
    expect(html).toContain('Blake');
    expect(html).toContain('How to Split Names into Random Teams');
    expect(html).toContain('Frequently Asked Questions (FAQ)');
    expect(html).toContain('applicationCategory');
  });

  it('should render NFL page to HTML containing 32 teams information and FAQ', async () => {
    const memoryHistory = createMemoryHistory({ initialEntries: ['/random-nfl-team-generator'] });
    const router = createRouter({ routeTree, history: memoryHistory });
    await router.load();

    const html = renderToString(React.createElement(RouterProvider, { router }));

    expect(html).toContain('Random NFL Team Generator');
    expect(html).toContain('National Football League');
    expect(html).toContain('AFC');
    expect(html).toContain('NFC');
    expect(html).toContain('NFL Team Picker FAQ');
  });

  it('should render NBA and MLB pages cleanly', async () => {
    const nbaHistory = createMemoryHistory({ initialEntries: ['/random-nba-team-generator'] });
    const nbaRouter = createRouter({ routeTree, history: nbaHistory });
    await nbaRouter.load();
    const nbaHtml = renderToString(React.createElement(RouterProvider, { router: nbaRouter }));
    expect(nbaHtml).toContain('Random NBA Team Generator');
    expect(nbaHtml).toContain('National Basketball Association');

    const mlbHistory = createMemoryHistory({ initialEntries: ['/random-mlb-team-generator'] });
    const mlbRouter = createRouter({ routeTree, history: mlbHistory });
    await mlbRouter.load();
    const mlbHtml = renderToString(React.createElement(RouterProvider, { router: mlbRouter }));
    expect(mlbHtml).toContain('Random MLB Team Generator');
    expect(mlbHtml).toContain('Major League Baseball');
  });

  it('should have optimal title length, meta description, canonical, and social media tags in index.html', async () => {
    const fs = await import('fs');
    const indexHtml = fs.readFileSync('index.html', 'utf-8');

    // Title length check (40-60 characters)
    const titleMatch = indexHtml.match(/<title>(.*?)<\/title>/);
    expect(titleMatch).toBeTruthy();
    const title = titleMatch![1];
    expect(title.length).toBeGreaterThanOrEqual(40);
    expect(title.length).toBeLessThanOrEqual(60);

    // Meta Description check
    const descMatch = indexHtml.match(/<meta name="description" content="(.*?)" \/>/);
    expect(descMatch).toBeTruthy();
    const desc = descMatch![1];
    expect(desc.length).toBeGreaterThanOrEqual(100);

    // Canonical URL check
    expect(indexHtml).toContain('<link rel="canonical" href="https://teamgenerator.org/" />');

    // Social Media Meta Tags Check (Open Graph & Twitter)
    expect(indexHtml).toContain('<meta property="og:type" content="website" />');
    expect(indexHtml).toContain('<meta property="og:url" content="https://teamgenerator.org/" />');
    expect(indexHtml).toContain('<meta property="og:title"');
    expect(indexHtml).toContain('<meta property="og:description"');
    expect(indexHtml).toContain('<meta property="og:image"');
    expect(indexHtml).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(indexHtml).toContain('<meta name="twitter:title"');
    expect(indexHtml).toContain('<meta name="twitter:description"');
  });
});

