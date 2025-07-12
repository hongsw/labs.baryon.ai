const https = require('https');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

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
    const ext = path.extname(file).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const filePath = path.join(SCREENSHOTS_DIR, file);
      const content = fs.readFileSync(filePath);
      attachments.push({
        filename: file,
        content: content, // Resend expects Buffer or string for content
        filePath: filePath, // 업로드용 경로도 저장
      });
    }
  }
} catch (error) {
  console.warn(`Could not read screenshots from ${SCREENSHOTS_DIR}:`, error.message);
  // Continue without attachments if directory not found or empty
}

console.log('attachments.length', attachments.length);


async function getUploadUrl(filename, filesize, mimetype) {
  // 인자 유효성 검사
  if (!filename || typeof filename !== 'string' || filename.trim() === '') {
    throw new Error('getUploadUrl: filename이 올바르지 않습니다. (filename: ' + filename + ')');
  }
  if (!filesize || typeof filesize !== 'number' || filesize <= 0) {
    throw new Error('getUploadUrl: filesize가 올바르지 않습니다. (filesize: ' + filesize + ')');
  }
  if (!mimetype || typeof mimetype !== 'string' || mimetype.trim() === '') {
    throw new Error('getUploadUrl: mimetype이 올바르지 않습니다. (mimetype: ' + mimetype + ')');
  }
  if (!SLACK_CHANNEL_ID || typeof SLACK_CHANNEL_ID !== 'string' || !SLACK_CHANNEL_ID.startsWith('C')) {
    throw new Error('getUploadUrl: SLACK_CHANNEL_ID가 올바르지 않습니다. (SLACK_CHANNEL_ID: ' + SLACK_CHANNEL_ID + ')');
  }
  const data = querystring.stringify({
    filename: filename,
    length: filesize,
    filetype: mimetype,
    channels: SLACK_CHANNEL_ID, // 필요시 추가
  });
  console.log('getUploadUrl 전송 form:', data);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'slack.com',
      path: '/api/files.getUploadURLExternal',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        const result = JSON.parse(responseData);
        console.log('Slack API 응답:', result);
        if (result.ok) {
          resolve(result);
        } else {
          reject(new Error(result.error));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function uploadToPresignedUrl(url, fileBuffer, mimetype) {
  return new Promise((resolve, reject) => {
    const { hostname, pathname, search } = new URL(url);
    const options = {
      hostname,
      path: pathname + (search || ''),
      method: 'PUT',
      headers: {
        'Content-Type': mimetype,
        'Content-Length': fileBuffer.length,
      },
    };
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        console.log('Upload 응답 status:', res.statusCode, 'body:', responseData);
        if (res.statusCode === 200 || res.statusCode === 302) resolve();
        else reject(new Error('Upload failed: ' + res.statusCode + ' ' + responseData));
      });
    });
    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

async function completeUploadExternal(files, channel) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      files,
      channel_id: channel, // 반드시 포함
    });
    const options = {
      hostname: 'slack.com',
      path: '/api/files.completeUploadExternal',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        const result = JSON.parse(responseData);
        if (result.ok) resolve(result);
        else reject(new Error(result.error));
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return 'application/octet-stream';
}

async function uploadFileToSlack(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  const filesize = fileBuffer.length;
  const mimetype = getMimeType(fileName);
  // 1. presigned URL 요청
  const uploadUrlRes = await getUploadUrl(fileName, filesize, mimetype);
  const uploadUrl = uploadUrlRes.upload_url;
  const fileId = uploadUrlRes.file_id;
  // 2. presigned URL로 파일 업로드
  await uploadToPresignedUrl(uploadUrl, fileBuffer, mimetype);
  // 3. 업로드 완료 알리기
  await completeUploadExternal([{ id: fileId }], SLACK_CHANNEL_ID);
  return fileId;
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
    try {
      await uploadFileToSlack(att.filePath, att.filename);
      uploadedCount++;
    } catch (e) {
      console.error(`${att.filename} 업로드 실패:`, e.message);
    }
  }
  // 파일 업로드 후, 업로드된 파일 개수만 안내하는 메시지 전송
  await postMessageToSlack([], attachments.length);
}

main();