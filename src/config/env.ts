// Application environment variables configuration

function cleanValue(val: string | undefined): string {
  if (!val || val.trim() === '') {
    return '';
  }
  return val.replace(/^["']|["']$/g, '');
}

const turnstileSiteKey = cleanValue(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
const siteUrl = cleanValue(process.env.NEXT_PUBLIC_SITE_URL);
const apiUrl = cleanValue(process.env.NEXT_PUBLIC_API_URL);

const missingVars: string[] = [];
if (!turnstileSiteKey) missingVars.push('NEXT_PUBLIC_TURNSTILE_SITE_KEY');
if (!siteUrl) missingVars.push('NEXT_PUBLIC_SITE_URL');
if (!apiUrl) missingVars.push('NEXT_PUBLIC_API_URL');

if (missingVars.length > 0) {
  throw new Error(
    `\n[FATAL ERROR] Missing required environment variables in .env:\n` +
      missingVars.map((v) => `  - ${v}`).join('\n') +
      `\n\nPlease specify them in your .env configuration file before starting.\n`
  );
}

export const env = {
  turnstileSiteKey,
  siteUrl,
  apiUrl,
} as const;
