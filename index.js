import * as cheerio from "cheerio";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Missing ?q= parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const searchUrl = `https://baiscopes.lk/?s=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; WhiteShadowBot/1.0)",
        },
      });
      const html = await response.text();
      const $ = cheerio.load(html);

      const results = [];

      $(".post, article, .blog-post").each((_, el) => {
        const title = $(el).find("h2 a, h3 a").first().text().trim();
        const link = $(el).find("h2 a, h3 a").first().attr("href");
        const img =
          $(el).find("img").attr("src") || $(el).find("img").attr("data-src");
        const excerpt = $(el).find("p").first().text().trim().slice(0, 150);

        if (title && link)
          results.push({
            title,
            link,
            image: img || null,
            description: excerpt || null,
          });
      });

      return new Response(JSON.stringify({ query, count: results.length, results }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
