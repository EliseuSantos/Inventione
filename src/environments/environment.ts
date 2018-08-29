import env from './.env';

export const environment = {
  production: false,
  version: env.npm_package_version + '-dev',
  serverUrl: 'https://geek-jokes.sameerkumar.website/api',
  defaultLanguage: 'en-US',
  supportedLanguages: [
    'en-US',
    'pt-BR'
  ]
};
