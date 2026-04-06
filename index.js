/**
 * Webflow Cloud Edge Optimizer (Vanilla JS)
 * Goal: 99-100 PageSpeed via Dynamic CSS Preloading
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 1. Check the Cache first for the optimized version
    const cache = caches.default;
    let cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;

    // 2. Fetch the original page from your Webflow origin
    // Example: https://your-site.webflow.io
    const originResponse = await fetch(`${env.WEBFLOW_ORIGIN}${url.pathname}${url.search}`, {
      headers: request.headers,
    });

    // If not HTML, just return the original response
    const contentType = originResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      return originResponse;
    }

    // 3. Use HTMLRewriter to inject the preload tag dynamically
    const transformer = new HTMLRewriter()
      .on('link[rel="stylesheet"]', {
        element(el) {
          const href = el.getAttribute("href");
          if (href && (href.includes("webflow.com") || href.includes("website-files.com"))) {
            el.before(`<link rel="preload" href="${href}" as="style">`, { html: true });
          }
        }
      });

    const optimizedResponse = transformer.transform(originResponse);

    // 4. Cache the result so it's instant for the next user
    // We clone the response because it can only be read once
    const responseToCache = optimizedResponse.clone();
    ctx.waitUntil(cache.put(request, responseToCache));

    return optimizedResponse;
  }
};
