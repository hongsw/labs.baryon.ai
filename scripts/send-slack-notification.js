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
 * 초기 배포 완료 메시지 전송 (메인 스레드)
 */
async function postInitialMessage(totalScreenshots) {
  console.log('📤 초기 배포 완료 메시지 전송 중...');
  
  const messageText = `🚀 *Deployment Complete!*\n\n🌐 *Website*: ${DEPLOY_URL}\n🔧 *GitHub Actions*: ${GITHUB_RUN_URL}\n📸 *Screenshots*: ${totalScreenshots}개 업로드 예정...`;
  
  try {
    const result = await slack.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      text: `Deployment complete! Processing ${totalScreenshots} screenshots...`,
      blocks: [
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
              text: `*🌐 Website:*\n<${DEPLOY_URL}|${DEPLOY_URL}>`
            },
            {
              type: 'mrkdwn',
              text: `*🔧 GitHub Actions:*\n<${GITHUB_RUN_URL}|View Run>`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `📸 *Screenshots:* ${totalScreenshots}개 업로드 중... 🔄`
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: '스크린샷들이 이 스레드에 업로드됩니다 👇'
            }
          ]
        }
      ]
    });
    
    if (result.ok) {
      console.log('✅ 초기 메시지 전송 성공');
      console.log(`📍 스레드 TS: ${result.ts}`);
      return result.ts; // 스레드 식별자 반환
    } else {
      throw new Error(result.error || '초기 메시지 전송 실패');
    }
  } catch (error) {
    console.error('❌ 초기 메시지 전송 실패:', error.message);
    throw error;
  }
}

/**
 * 스레드에 파일 업로드
 */
async function uploadFileToThread(filePath, fileName, threadTs) {
  console.log(`\n=== ${fileName} 스레드 업로드 시작 ===`);
  
  try {
    const fileStats = fs.statSync(filePath);
    console.log(`파일 크기: ${fileStats.size} bytes`);
    
    // 스레드에 파일 업로드
    const result = await slack.filesUploadV2({
      // 파일 정보
      file: fs.createReadStream(filePath),
      filename: fileName,
      
      // 스레드 설정
      channels: SLACK_CHANNEL_ID,
      thread_ts: threadTs, // 스레드 식별자
      initial_comment: `📸 ${fileName.replace(/\.[^/.]+$/, '')}`, // 확장자 제거한 간단한 설명
      title: fileName.replace(/\.[^/.]+$/, ''), // 파일 제목
    });
    
    if (result.ok && result.file) {
      const file = result.file;
      console.log(`✅ ${fileName} 스레드 업로드 성공!`);
      console.log(`- File ID: ${file.id}`);
      
      return {
        fileId: file.id,
        name: file.name,
        title: file.title,
        permalink: file.permalink,
        success: true
      };
    } else {
      throw new Error(result.error || '알 수 없는 오류');
    }
    
  } catch (error) {
    console.error(`❌ ${fileName} 스레드 업로드 실패:`, error.message);
    
    // 실패한 경우 스레드에 에러 메시지 전송 - 안함
    // try {
    //   await slack.chat.postMessage({
    //     channel: SLACK_CHANNEL_ID,
    //     thread_ts: threadTs,
    //     text: `❌ ${fileName} 업로드 실패: ${error.message}`
    //   });
    // } catch (msgError) {
    //   console.error('에러 메시지 전송 실패:', msgError.message);
    // }
    
    return {
      fileName: fileName,
      error: error.message,
      success: false
    };
  }
}

/**
 * 초기 메시지 업데이트 (최종 결과 반영)
 */
async function updateInitialMessage(threadTs, uploadResults, totalCount) {
  const successCount = uploadResults.filter(r => r.success).length;
  const failedCount = totalCount - successCount;
  
  const statusEmoji = successCount === totalCount ? '✅' : failedCount === 0 ? '⚠️' : '❌';
  const statusText = successCount === totalCount ? 'Complete' : 'Partial';
  
  try {
    const result = await slack.chat.update({
      channel: SLACK_CHANNEL_ID,
      ts: threadTs,
      text: `Deployment ${statusText.toLowerCase()}! ${successCount}/${totalCount} screenshots uploaded.`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${statusEmoji} Deployment ${statusText}`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*🌐 Website:*\n<${DEPLOY_URL}|${DEPLOY_URL}>`
            },
            {
              type: 'mrkdwn',
              text: `*🔧 GitHub Actions:*\n<${GITHUB_RUN_URL}|View Run>`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `📸 *Screenshots:* ${successCount}/${totalCount} uploaded ${statusEmoji}`
          }
        },
        ...(failedCount > 0 ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `⚠️ ${failedCount}개 파일 업로드 실패`
          }
        }] : []),
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '🌐 Visit Website'
              },
              url: DEPLOY_URL,
              style: 'primary'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '🔧 View Build'
              },
              url: GITHUB_RUN_URL
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: successCount > 0 ? '스크린샷들을 보려면 아래 스레드를 확인하세요 👇' : '스크린샷 업로드에 실패했습니다.'
            }
          ]
        }
      ]
    });
    
    if (result.ok) {
      console.log('✅ 초기 메시지 업데이트 성공');
    } else {
      console.error('❌ 초기 메시지 업데이트 실패:', result.error);
    }
  } catch (error) {
    console.error('❌ 초기 메시지 업데이트 중 오류:', error.message);
  }
}

/**
 * 스레드에 최종 요약 메시지 추가
 */
async function postThreadSummary(threadTs, uploadResults, totalCount) {
  const successCount = uploadResults.filter(r => r.success).length;
  const failedFiles = uploadResults.filter(r => !r.success);
  
  let summaryText = `📊 *업로드 완료 요약*\n`;
  summaryText += `✅ 성공: ${successCount}개\n`;
  
  if (failedFiles.length > 0) {
    summaryText += `❌ 실패: ${failedFiles.length}개\n`;
    summaryText += `\n*실패한 파일들:*\n`;
    failedFiles.forEach(file => {
      summaryText += `• ${file.fileName}\n`;
    });
  }
  
  try {
    await slack.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      thread_ts: threadTs,
      text: summaryText,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: summaryText
          }
        }
      ]
    });
    
    console.log('✅ 스레드 요약 메시지 전송 성공');
  } catch (error) {
    console.error('❌ 스레드 요약 메시지 전송 실패:', error.message);
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('\n🚀 스레드 기반 Slack 이미지 업로드 시작...\n');
  
  // 환경 변수 검증
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
  
  const totalCount = attachments.length;
  
  if (totalCount === 0) {
    console.log('📋 업로드할 스크린샷 파일이 없습니다.');
    
    // 스크린샷이 없어도 배포 완료 메시지는 전송
    await postInitialMessage(0);
    return;
  }
  
  // 1단계: 초기 메시지 전송
  console.log('\n📤 1단계: 초기 배포 완료 메시지 전송...');
  const threadTs = await postInitialMessage(totalCount);
  
  if (!threadTs) {
    console.error('❌ 초기 메시지 전송에 실패하여 프로그램을 종료합니다.');
    return;
  }
  
  // 2단계: 각 파일을 스레드에 업로드
  console.log('\n📸 2단계: 스크린샷들을 스레드에 업로드...');
  const uploadResults = [];
  
  for (let i = 0; i < attachments.length; i++) {
    const att = attachments[i];
    console.log(`\n[${i + 1}/${totalCount}] ${att.filename} 스레드 업로드 중...`);
    
    const result = await uploadFileToThread(att.filePath, att.filename, threadTs);
    uploadResults.push(result);
    
    // API rate limit 방지를 위한 딜레이 (마지막 파일이 아닌 경우)
    if (i < attachments.length - 1) {
      console.log('⏳ 다음 파일 처리를 위해 1초 대기...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // 3단계: 결과 요약
  const successCount = uploadResults.filter(r => r.success).length;
  const failedCount = totalCount - successCount;
  
  console.log(`\n📊 업로드 완료 결과:`);
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failedCount}개`);
  
  // 4단계: 초기 메시지 업데이트
  console.log('\n🔄 3단계: 초기 메시지 업데이트...');
  await updateInitialMessage(threadTs, uploadResults, totalCount);
  
  // 5단계: 스레드에 요약 메시지 추가
  console.log('\n📋 4단계: 스레드 요약 메시지 추가...');
  // await postThreadSummary(threadTs, uploadResults, totalCount);
  
  console.log('\n✨ 모든 작업 완료!');
  console.log(`🔗 스레드 링크: https://${(await slack.auth.test()).team}.slack.com/archives/${SLACK_CHANNEL_ID}/p${threadTs.replace('.', '')}`);
}

// 프로그램 실행
main().catch(error => {
  console.error('❌ 프로그램 실행 중 오류:', error);
  process.exit(1);
});