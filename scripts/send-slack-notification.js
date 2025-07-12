const https = require('https');
const fs = require('fs');
const path = require('path');

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const DEPLOY_URL = process.env.DEPLOY_URL;
const GITHUB_RUN_URL = process.env.GITHUB_RUN_URL;
const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots'); // Assuming screenshots are in the root of the workspace



const attachments = [];

try {
  const files = fs.readdirSync(SCREENSHOTS_DIR);
  console.log(`SCREENSHOTS_DIR(${SCREENSHOTS_DIR}) 하위 파일 목록:`);
  files.forEach(f => console.log(' -', f));
  for (const file of files) {
    const filePath = path.join(SCREENSHOTS_DIR, file);
    const content = fs.readFileSync(filePath);
    attachments.push({
      filename: file,
      content: content, // Resend expects Buffer or string for content
      filePath: filePath, // 업로드용 경로도 저장
    });
  }
} catch (error) {
  console.warn(`Could not read screenshots from ${SCREENSHOTS_DIR}:`, error.message);
  // Continue without attachments if directory not found or empty
}

console.log('attachments.length', attachments.length);


async function uploadFileToSlack(filePath, fileName) {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath);
    const boundary = '----WebKitFormBoundary' + Math.random().toString().substr(2);
    const postData = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="channels"\r\n\r\n${SLACK_CHANNEL_ID}`,
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`,
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
          console.log(`File ${fileName} uploaded to Slack successfully.`);
          resolve(result.file.permalink);
        } else {
          console.error(`Failed to upload file ${fileName} to Slack:`, result.error);
          reject(new Error(result.error));
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with file upload request for ${fileName}:`, e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function postMessageToSlack(imageBlocks, screenshotCount) {
  if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL_ID) {
    console.error('SLACK_BOT_TOKEN or SLACK_CHANNEL_ID is not set.');
    process.exit(1);
  }

  const messageText = `Deployment to ${DEPLOY_URL} is complete!\nView website: ${DEPLOY_URL}\nGitHub Actions Run: ${GITHUB_RUN_URL}\n총 스크린샷 이미지 개수: ${screenshotCount}개`;
  const blocks = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": messageText
      }
    },
    ...imageBlocks
  ];

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
  let uploadedCount = 0;
  for (const att of attachments) {
    if (att.filename.endsWith('.png') || att.filename.endsWith('.jpg') || att.filename.endsWith('.jpeg')) {
      try {
        await uploadFileToSlack(att.filePath, att.filename); // 파일 자체를 슬랙에 첨부
        uploadedCount++;
      } catch (e) {
        console.error(`${att.filename} 업로드 실패:`, e.message);
      }
    }
  }
  // 파일 업로드 후, 업로드된 파일 개수만 안내하는 메시지 전송
  await postMessageToSlack([], uploadedCount);
}

main();