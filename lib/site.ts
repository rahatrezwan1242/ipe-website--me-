// Netlify sets `URL` at build time to the site's canonical live URL
// (custom domain if configured, otherwise the Netlify subdomain).
export const SITE_URL = process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:3000";
