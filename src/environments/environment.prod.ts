import env from './.env';

export const environment = {
  production: true,
  version: env.npm_package_version,
  serverUrl: 'https://geek-jokes.sameerkumar.website/api',
  defaultLanguage: 'en-US',
  supportedLanguages: [
    'en-US',
    'pt-BR'
  ]
};
