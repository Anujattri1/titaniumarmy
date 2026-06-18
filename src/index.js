const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' https://images.unsplash.com https://i.ytimg.com https://ts1.mm.bing.net data:; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; upgrade-insecure-requests",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy": "same-origin"
};

const cacheControlFor = pathname => {
  if (/\.(css|js|svg|png|jpg|jpeg|webp|avif|ico|woff2?)$/i.test(pathname)) {
    return "public, max-age=31536000, immutable";
  }

  if (/\/(robots\.txt|sitemap\.xml|site\.webmanifest)$/i.test(pathname)) {
    return "public, max-age=3600";
  }

  return "public, max-age=0, must-revalidate";
};

const withSecurityHeaders = (response, request) => {
  const url = new URL(request.url);
  const headers = new Headers(response.headers);

  Object.entries(SECURITY_HEADERS).forEach(([name, value]) => {
    headers.set(name, value);
  });

  headers.set("Cache-Control", cacheControlFor(url.pathname));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);
    return withSecurityHeaders(response, request);
  }
};
