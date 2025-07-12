const { WebClient } = require('@slack/web-api');
const fs = require('fs');
const path = require('path');

// Slack 클라이언트 초기화
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const DEPLOY_URL = process.env.DEPLOY_URL;
const GITHUB_RUN_URL = process.env.GITHUB_RUN_URL;
const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');

const attachments = [];

// 스크린샷 파일 목록 수집
try {
  const files = fs.readdirSync(SCREENSHOTS_DIR);
  console.log(`SCREENSHOTS_DIR(${SCREENSHOTS_DIR}) 하위 파일 목록:`);
  files.forEach(f => console.log(' -', f));
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      const filePath = path.join(SCREENSHOTS_DIR, file);
      attachments.push({
        filename: file,
        filePath: filePath,
      });
    }
  }
} catch (error) {
  console.warn(`Could not read screenshots from ${SCREENSHOTS_DIR}:`, error.message);
}

console.log('총 업로드할 파일 수:', attachments.length);

/**
 * Slack SDK의 uploadV2를 사용한 파일 업로드
 */
async function uploadFileToSlack(filePath, fileName) {
  console.log(`\n=== ${fileName} 업로드 시작 ===`);
  
  try {
    const fileStats = fs.statSync(filePath);
    console.log(`파일 크기: ${fileStats.size} bytes`);
    
    // Slack SDK의 uploadV2 메서드 사용 (files.getUploadURLExternal + files.completeUploadExternal 래핑)
    const result = await slack.filesUploadV2({
      // 파일 정보
      file: fs.createReadStream(filePath),
      filename: fileName,
      
      // 업로드 설정
      channels: SLACK_CHANNEL_ID,
      initial_comment: `📸 Screenshot: ${fileName}`,
      title: fileName.replace(/\.[^/.]+$/, ''), // 확장자 제거한 제목
      
      // 추가 메타데이터
      thread_ts: undefined, // 스레드에 업로드하려면 여기에 timestamp 지정
    });
    
    if (result.ok && result.file) {
      const file = result.file;
      console.log(`✅ ${fileName} 업로드 성공!`);
      console.log(`- File ID: ${file.id}`);
      console.log(`- Permalink: ${file.permalink || 'N/A'}`);
      console.log(`- Private URL: ${file.url_private || 'N/A'}`);
      
      return {
        fileId: file.id,
        permalink: file.permalink,
        url_private: file.url_private,
        name: file.name,
        title: file.title,
        success: true
      };
    } else {
      throw new Error(result.error || '알 수 없는 오류');
    }
    
  } catch (error) {
    console.error(`❌ ${fileName} 업로드 실패:`, error.message);
    return {
      fileName: fileName,
      error: error.message,
      success: false
    };
  }
}

/**
 * 요약 메시지 전송
 */
async function postSummaryMessage(uploadResults, totalCount) {
  const successCount = uploadResults.filter(r => r.success).length;
  const failedCount = totalCount - successCount;
  
  const statusEmoji = successCount === totalCount ? '✅' : '⚠️';
  
  // 메시지 텍스트 구성
  let messageText = `${statusEmoji} *Deployment Complete!*\n\n`;
  messageText += `🌐 *Website*: ${DEPLOY_URL}\n`;
  messageText += `🔧 *GitHub Actions*: ${GITHUB_RUN_URL}\n`;
  messageText += `📸 *Screenshots*: ${successCount}/${totalCount} uploaded successfully`;
  
  if (failedCount > 0) {
    messageText += `\n⚠️ ${failedCount} files failed to upload`;
  }
  
  // 성공한 파일들의 간단한 목록 추가
  const successfulFiles = uploadResults.filter(r => r.success);
  if (successfulFiles.length > 0 && successfulFiles.length <= 5) {
    messageText += '\n\n📋 *Uploaded Files:*\n';
    successfulFiles.forEach(file => {
      messageText += `• ${file.name || file.fileName}\n`;
    });
  } else if (successfulFiles.length > 5) {
    messageText += `\n\n📋 *${successfulFiles.length} files uploaded*`;
  }
  
  try {
    const result = await slack.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      text: messageText, // fallback text
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: messageText
          }
        }
      ]
    });
    
    if (result.ok) {
      console.log('📤 요약 메시지 전송 성공');
    } else {
      console.error('❌ 요약 메시지 전송 실패:', result.error);
    }
  } catch (error) {
    console.error('❌ 요약 메시지 전송 중 오류:', error.message);
  }
}

/**
 * 대안: Block Kit을 사용한 리치 메시지 (선택사항)
 */
async function postRichSummaryMessage(uploadResults, totalCount) {
  const successCount = uploadResults.filter(r => r.success).length;
  const successfulFiles = uploadResults.filter(r => r.success);
  
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '🚀 Deployment Complete'
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Website:*\n${DEPLOY_URL}`
        },
        {
          type: 'mrkdwn',
          text: `*Screenshots:*\n${successCount}/${totalCount} uploaded`
        }
      ]
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '🌐 View Website'
          },
          url: DEPLOY_URL,
          style: 'primary'
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '🔧 GitHub Actions'
          },
          url: GITHUB_RUN_URL
        }
      ]
    }
  ];
  
  // 업로드된 파일 목록 추가 (최대 10개)
  if (successfulFiles.length > 0) {
    const fileList = successfulFiles.slice(0, 10).map(file => 
      `• <${file.permalink}|${file.name || file.fileName}>`
    ).join('\n');
    
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*📸 Uploaded Screenshots:*\n${fileList}${successfulFiles.length > 10 ? `\n...and ${successfulFiles.length - 10} more` : ''}`
      }
    });
  }
  
  try {
    const result = await slack.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      text: `Deployment complete! ${successCount}/${totalCount} screenshots uploaded.`,
      blocks: blocks
    });
    
    if (result.ok) {
      console.log('📤 리치 요약 메시지 전송 성공');
    } else {
      console.error('❌ 리치 요약 메시지 전송 실패:', result.error);
    }
  } catch (error) {
    console.error('❌ 리치 요약 메시지 전송 중 오류:', error.message);
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('\n🚀 Slack SDK를 사용한 이미지 업로드 시작...\n');
  
  if (!process.env.SLACK_BOT_TOKEN) {
    console.error('❌ SLACK_BOT_TOKEN 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }
  
  if (!SLACK_CHANNEL_ID) {
    console.error('❌ SLACK_CHANNEL_ID 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }
  
  // Slack 연결 테스트
  try {
    const authTest = await slack.auth.test();
    console.log(`✅ Slack 인증 성공: ${authTest.user} (${authTest.team})`);
  } catch (error) {
    console.error('❌ Slack 인증 실패:', error.message);
    process.exit(1);
  }
  
  const uploadResults = [];
  const totalCount = attachments.length;
  
  if (totalCount === 0) {
    console.log('📋 업로드할 스크린샷 파일이 없습니다.');
    return;
  }
  
  // 각 파일을 순차적으로 업로드
  for (let i = 0; i < attachments.length; i++) {
    const att = attachments[i];
    console.log(`\n[${i + 1}/${totalCount}] ${att.filename} 처리 중...`);
    
    const result = await uploadFileToSlack(att.filePath, att.filename);
    uploadResults.push(result);
    
    // API rate limit 방지를 위한 딜레이 (마지막 파일이 아닌 경우)
    if (i < attachments.length - 1) {
      console.log('⏳ 다음 파일 처리를 위해 1초 대기...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // 결과 요약
  const successCount = uploadResults.filter(r => r.success).length;
  const failedCount = totalCount - successCount;
  
  console.log(`\n📊 업로드 완료 결과:`);
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failedCount}개`);
  
  if (failedCount > 0) {
    console.log('\n실패한 파일들:');
    uploadResults.filter(r => !r.success).forEach(r => {
      console.log(`- ${r.fileName}: ${r.error}`);
    });
  }
  
  // 요약 메시지 전송 (일반 메시지 또는 리치 메시지 선택)
  console.log('\n📤 요약 메시지 전송 중...');
  
  // 리치 메시지 사용 (Block Kit)
  await postRichSummaryMessage(uploadResults, totalCount);
  
  // 또는 간단한 메시지 사용
  // await postSummaryMessage(uploadResults, totalCount);
  
  console.log('\n✨ 모든 작업 완료!');
}

// 프로그램 실행
main().catch(error => {
  console.error('❌ 프로그램 실행 중 오류:', error);
  process.exit(1);
});