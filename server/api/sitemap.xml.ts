// server/routes/sitemap.xml.ts
export default defineEventHandler(async (event) => {
  // Fetch sitemap from your backend
  console.log('fetching sitemap');

  // Fetch sitemap from your backend
  const response = await fetch('https://squid-app-rqggb.ondigitalocean.app/seo/sitemap', {
    headers: {
      'accept': '*/*'
    }
  });

  const sitemap = await response.text();

  // Set appropriate headers
  setHeader(event, 'Content-Type', 'application/xml');
  setHeader(event, 'Cache-Control', 'max-age=3600, s-maxage=3600, stale-while-revalidate');

  return sitemap;
});