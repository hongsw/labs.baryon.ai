const https = require('https');

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const DEPLOY_URL = process.env.DEPLOY_URL;
const GITHUB_RUN_URL = process.env.GITHUB_RUN_URL;

async function sendSlackNotification() {
  if (!SLACK_WEBHOOK_URL) {
    console.error('SLACK_WEBHOOK_URL is not set.');
    process.exit(1);
  }

  const message = {
    text: `Deployment to ${DEPLOY_URL} is complete!\nScreenshots: ${GITHUB_RUN_RUN_URL}\nView website: ${DEPLOY_URL}`,
  };

  const data = JSON.stringify(message);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const req = https.request(SLACK_WEBHOOK_URL, options, (res) => {
    console.log(`Slack notification statusCode: ${res.statusCode}`);
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (error) => {
    console.error('Failed to send Slack notification:', error);
    process.exit(1);
  });

  req.write(data);
  req.end();
}

sendSlackNotification();
