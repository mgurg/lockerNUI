// server/routes/sitemap.xml.ts
export default defineEventHandler(async (event) => {
  console.log('fetching sitemap');

  // Fetch sitemap from your backend
  const response = await fetch('http://0.0.0.0:5000/seo/sitemap', {
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