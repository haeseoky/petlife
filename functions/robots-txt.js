export async function onRequest(context) {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Allow: /ads.txt',
    '',
    '# AdSense crawlers - explicit allow',
    'User-agent: Mediapartners-Google',
    'Allow: /',
    '',
    'User-agent: AdsBot-Google',
    'Allow: /',
    '',
    'User-agent: AdsBot-Google-Mobile',
    'Allow: /',
    '',
    'Sitemap: https://nutalk.co.kr/sitemap.xml',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
