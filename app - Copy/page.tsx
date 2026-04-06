'use client';

import { useEffect } from 'react';

export default function Page() {

  async function initializeOptimization() {
    // 1. Automatically get site info (No manual URL needed)
    const siteInfo = await webflow.getSiteInfo();
    
    const primaryDomain =
      siteInfo.domains.find(d => d.default) || siteInfo.domains[0];

    const originUrl = primaryDomain.url;

    // 2. Register the Webhook dynamically for this specific site
    await fetch('/api/register-webhook', {
      method: 'POST',
      body: JSON.stringify({
        siteId: siteInfo.siteId,
        originUrl: originUrl
      })
    });

    console.log(`Optimization active for: ${originUrl}`);
  }

  useEffect(() => {
    initializeOptimization();
  }, []);

  return <h1>Hello Next.js 🚀</h1>;
}