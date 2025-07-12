const { execSync } = require('child_process');
require('dotenv').config({ path: '.env.prod', override: true });

const secrets = [
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID',
  'RESEND_API_KEY'
];

for (const secret of secrets) {
  const value = process.env[secret];
  if (value) {
    console.log(`Setting secret: ${secret}`);
    try {
      execSync(`gh secret set ${secret}`, { input: value, stdio: 'inherit' });
      console.log(`Successfully set secret: ${secret}`);
    } catch (error) {
      console.error(`Failed to set secret: ${secret}`, error);
      process.exit(1);
    }
  } else {
    console.warn(`Skipping secret ${secret} because it is not defined in .env.prod`);
  }
}

console.log('All secrets processed.');
