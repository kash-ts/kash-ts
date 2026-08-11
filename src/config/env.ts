const requiredEnvVars = [
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
  'NEXT_PUBLIC_SITE_URL',
] as const;

function validateEnv() {
  const missingVars = requiredEnvVars.filter(
    (key) => !process.env[key] || process.env[key]?.trim() === ''
  );

  if (missingVars.length > 0) {
    throw new Error(
      `\n❌ [FATAL ERROR] Отсутствуют обязательные переменные окружения (.env):\n` +
        missingVars.map((v) => `  - ${v}`).join('\n') +
        `\n\nПожалуйста, укажите их в файле .env.local или переменных окружения перед запуском проекта.\n`
    );
  }
}

validateEnv();

export const env = {
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
} as const;
