/**
 * 🔍 Baiscope.lk Movie Search API
 * 👑 Creator: Chamod Nimsara
 * ⚡ Cloudflare Workers
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    // CORS headers
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Missing ?q= parameter", creator: "Chamod Nimsara" }),
        { headers }
      );
    }

    try {
      // Fetch search page with proper headers
      const response = await fetch(`https://baiscopes.lk/?s=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://baiscopes.lk/',
          'Accept-Language': 'en-US,en;q=0.9'
        },
      });

      const html = await response.text();

      // Load cheerio
      const cheerio = await import('cheerio');
      const $ = cheerio.load(html);

      const results = [];

      // Updated selector - check Baiscopes.lk HTML structure
      $('.post').each((i, el) => {
        const title = $(el).find('h2.entry-title a, h3.entry-title a').text().trim();
        const link = $(el).find('h2.entry-title a, h3.entry-title a').attr('href');
        const img = $(el).find('img').attr('src') || null;
        const excerpt = $(el).find('p').first().text().trim() || null;

        if (title && link) {
          results.push({ title, link, img, excerpt });
        }
      });

      return new Response(
        JSON.stringify({
          query,
          count: results.length,
          creator: "Chamod Nimsara",
          results
        }, null, 2),
        { headers }
      );

    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message, creator: "Chamod Nimsara" }),
        { headers }
      );
    }
  }
};
