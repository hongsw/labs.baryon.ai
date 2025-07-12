const https = require('https');
const fs = require('fs');
const path = require('path');

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const DEPLOY_URL = process.env.DEPLOY_URL;
const GITHUB_RUN_URL = process.env.GITHUB_RUN_URL;
const SCREENSHOTS_ZIP_PATH = path.join(process.cwd(), 'screenshots.zip');

async function uploadFileToSlack() {
  if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL_ID) {
    console.error('SLACK_BOT_TOKEN or SLACK_CHANNEL_ID is not set.');
    return null;
  }

  if (!fs.existsSync(SCREENSHOTS_ZIP_PATH)) {
    console.warn(`Screenshot zip file not found at ${SCREENSHOTS_ZIP_PATH}. Skipping file upload.`);
    return null;
  }

  const fileContent = fs.readFileSync(SCREENSHOTS_ZIP_PATH);

  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString().substr(2);
    const postData = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="channels"\r\n\r\n${SLACK_CHANNEL_ID}`,
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="screenshots.zip"\r\nContent-Type: application/zip\r\n\r\n`,
      fileContent,
      `\r\n--${boundary}--`,
    ].join('\r\n');

    const options = {
      hostname: 'slack.com',
      path: '/api/files.upload',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        const result = JSON.parse(responseData);
        if (result.ok) {
          console.log('File uploaded to Slack successfully.');
          resolve(result.file.permalink);
        } else {
          console.error('Failed to upload file to Slack:', result.error);
          reject(new Error(result.error));
        }
      });
    });

    req.on('error', (e) => {
      console.error('Problem with file upload request:', e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function postMessageToSlack(filePermalink) {
  if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL_ID) {
    console.error('SLACK_BOT_TOKEN or SLACK_CHANNEL_ID is not set.');
    return;
  }

  const messageText = `Deployment to ${DEPLOY_URL} is complete!\nView website: ${DEPLOY_URL}\nGitHub Actions Run: ${GITHUB_RUN_URL}`;
  const blocks = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": messageText
      }
    }
  ];

  if (filePermalink) {
    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Screenshots: <${filePermalink}|Download>`
      }
    });
  }

  const postData = JSON.stringify({
    channel: SLACK_CHANNEL_ID,
    blocks: blocks,
  });

  const options = {
    hostname: 'slack.com',
    path: '/api/chat.postMessage',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        const result = JSON.parse(responseData);
        if (result.ok) {
          console.log('Message posted to Slack successfully.');
          resolve();
        } else {
          console.error('Failed to post message to Slack:', result.error);
          reject(new Error(result.error));
        }
      });
    });

    req.on('error', (e) => {
      console.error('Problem with message post request:', e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  let filePermalink = null;
  try {
    filePermalink = await uploadFileToSlack();
  }
  catch (error) {
    console.error('Error during Slack file upload:', error.message);
  }

  try {
    await postMessageToSlack(filePermalink);
  }
  catch (error) {
    console.error('Error during Slack message post:', error.message);
  }
}

main();