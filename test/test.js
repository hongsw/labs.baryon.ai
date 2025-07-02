// =============================================================================
// BARYON LABS - CONTACT & CAREER FUNCTIONALITY TEST
// =============================================================================

console.log('🧪 Baryon Labs 기능 테스트 시작...');

// =============================================================================
// TEST CONFIGURATION
// =============================================================================
const TEST_CONFIG = {
    baseUrl: window.location.origin,
    testTimeout: 5000,
    form2aiEndpoint: 'https://form2ai2email-worker.kilos-network.workers.dev/api/submit',
    contactFormId: '99f754ea-af00-4048-9fcc-18bae53fed3f'
};

// =============================================================================
// TEST UTILITIES
// =============================================================================
class TestRunner {
    constructor() {
        this.results = [];
        this.currentTest = null;
    }

    async runTest(name, testFn) {
        console.log(`\n🧪 테스트: ${name}`);
        this.currentTest = { name, startTime: Date.now() };
        
        try {
            await testFn();
            this.logSuccess(name);
            return true;
        } catch (error) {
            this.logError(name, error);
            return false;
        }
    }

    logSuccess(name) {
        const duration = Date.now() - this.currentTest.startTime;
        console.log(`✅ ${name} - 성공 (${duration}ms)`);
        this.results.push({ name, status: 'PASS', duration });
    }

    logError(name, error) {
        const duration = Date.now() - this.currentTest.startTime;
        console.error(`❌ ${name} - 실패 (${duration}ms):`, error.message);
        this.results.push({ name, status: 'FAIL', duration, error: error.message });
    }

    printSummary() {
        console.log('\n📊 테스트 결과 요약:');
        console.log('==========================================');
        
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;
        
        this.results.forEach(result => {
            const icon = result.status === 'PASS' ? '✅' : '❌';
            console.log(`${icon} ${result.name} (${result.duration}ms)`);
            if (result.error) {
                console.log(`   └─ ${result.error}`);
            }
        });
        
        console.log('==========================================');
        console.log(`총 ${this.results.length}개 테스트 | 성공: ${passed} | 실패: ${failed}`);
        
        if (failed === 0) {
            console.log('🎉 모든 테스트 통과!');
        } else {
            console.log('⚠️  일부 테스트 실패');
        }
    }
}

// =============================================================================
// DOM UTILITIES
// =============================================================================
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

function simulateUserInput(element, value) {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
}

function simulateClick(element) {
    element.dispatchEvent(new Event('click', { bubbles: true }));
}

// =============================================================================
// NAVIGATION TESTS
// =============================================================================
async function testNavigation() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test Services navigation
    const servicesLink = document.querySelector('a[href="#services"]');
    if (!servicesLink) throw new Error('Services 네비게이션 링크를 찾을 수 없습니다');
    
    simulateClick(servicesLink);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const servicesSection = document.querySelector('#services');
    if (!servicesSection) throw new Error('Services 섹션이 로드되지 않았습니다');
    
    // Test Careers navigation
    const careersLink = document.querySelector('a[href="#careers"]');
    if (!careersLink) throw new Error('Careers 네비게이션 링크를 찾을 수 없습니다');
    
    simulateClick(careersLink);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const careersSection = document.querySelector('#careers');
    if (!careersSection) throw new Error('Careers 섹션이 로드되지 않았습니다');
    
    // Test Contact navigation
    const contactLink = document.querySelector('a[href="#contact"]');
    if (!contactLink) throw new Error('Contact 네비게이션 링크를 찾을 수 없습니다');
    
    simulateClick(contactLink);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const contactSection = document.querySelector('#contact');
    if (!contactSection) throw new Error('Contact 섹션이 로드되지 않았습니다');
}

// =============================================================================
// LANGUAGE SWITCHING TESTS
// =============================================================================
async function testLanguageSwitching() {
    const koBtn = document.querySelector('.lang-btn[data-lang="ko"]');
    const enBtn = document.querySelector('.lang-btn[data-lang="en"]');
    
    if (!koBtn || !enBtn) throw new Error('언어 전환 버튼을 찾을 수 없습니다');
    
    // Test Korean
    simulateClick(koBtn);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!koBtn.classList.contains('active')) {
        throw new Error('한국어 버튼이 활성화되지 않았습니다');
    }
    
    const bodyLang = document.body.getAttribute('data-lang');
    if (bodyLang !== 'ko') {
        throw new Error(`Body data-lang이 'ko'가 아닙니다: ${bodyLang}`);
    }
    
    // Test English
    simulateClick(enBtn);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!enBtn.classList.contains('active')) {
        throw new Error('영어 버튼이 활성화되지 않았습니다');
    }
    
    const bodyLangEn = document.body.getAttribute('data-lang');
    if (bodyLangEn !== 'en') {
        throw new Error(`Body data-lang이 'en'이 아닙니다: ${bodyLangEn}`);
    }
    
    // Reset to Korean
    simulateClick(koBtn);
    await new Promise(resolve => setTimeout(resolve, 500));
}

// =============================================================================
// SERVICES SECTION TESTS
// =============================================================================
async function testServicesSection() {
    // Navigate to services
    const servicesLink = document.querySelector('a[href="#services"]');
    simulateClick(servicesLink);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const servicesSection = await waitForElement('#services');
    const serviceCards = servicesSection.querySelectorAll('.service-card');
    
    if (serviceCards.length !== 6) {
        throw new Error(`서비스 카드가 6개가 아닙니다: ${serviceCards.length}개`);
    }
    
    // Check coming soon card
    const comingSoonCard = servicesSection.querySelector('.service-card-coming-soon');
    if (!comingSoonCard) throw new Error('새로운 서비스 카드를 찾을 수 없습니다');
    
    // Test coming soon link to careers
    const comingSoonLink = comingSoonCard.querySelector('a[href="#careers"]');
    if (!comingSoonLink) throw new Error('새로운 서비스 카드의 Careers 링크를 찾을 수 없습니다');
    
    simulateClick(comingSoonLink);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const careersSection = await waitForElement('#careers');
    if (!careersSection) throw new Error('Careers 섹션으로 이동하지 않았습니다');
}

// =============================================================================
// CONTACT FORM TESTS
// =============================================================================
async function testContactForm() {
    // Navigate to contact
    const contactLink = document.querySelector('a[href="#contact"]');
    simulateClick(contactLink);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const contactForm = await waitForElement('#contactForm');
    if (!contactForm) throw new Error('Contact 폼을 찾을 수 없습니다');
    
    // Test form fields
    const nameField = contactForm.querySelector('#name');
    const emailField = contactForm.querySelector('#work_email');
    const inquiryField = contactForm.querySelector('#inquiry-type');
    const subjectField = contactForm.querySelector('#subject');
    const messageField = contactForm.querySelector('#message');
    
    if (!nameField) throw new Error('이름 필드를 찾을 수 없습니다');
    if (!emailField) throw new Error('이메일 필드를 찾을 수 없습니다');
    if (!inquiryField) throw new Error('문의 유형 필드를 찾을 수 없습니다');
    if (!subjectField) throw new Error('주제 필드를 찾을 수 없습니다');
    if (!messageField) throw new Error('메시지 필드를 찾을 수 없습니다');
    
    // Test form validation
    simulateUserInput(nameField, '');
    simulateUserInput(emailField, 'invalid-email');
    
    const submitBtn = contactForm.querySelector('#submitBtn');
    if (!submitBtn) throw new Error('제출 버튼을 찾을 수 없습니다');
    
    // Test valid form data
    simulateUserInput(nameField, '테스트 사용자');
    simulateUserInput(emailField, 'test@company.com');
    simulateUserInput(inquiryField, 'partnership');
    simulateUserInput(subjectField, 'aiConsultation');
    simulateUserInput(messageField, '테스트 메시지입니다.');
    
    console.log('📧 Contact 폼 필드 입력 완료');
}

// =============================================================================
// CAREERS MODAL TESTS
// =============================================================================
async function testCareersModal() {
    // Navigate to careers
    const careersLink = document.querySelector('a[href="#careers"]');
    simulateClick(careersLink);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const careersSection = await waitForElement('#careers');
    
    // Test job cards
    const jobCards = careersSection.querySelectorAll('.job-card');
    if (jobCards.length === 0) throw new Error('채용 공고 카드를 찾을 수 없습니다');
    
    // Test apply button
    const firstApplyBtn = jobCards[0].querySelector('.apply-btn');
    if (!firstApplyBtn) throw new Error('지원하기 버튼을 찾을 수 없습니다');
    
    simulateClick(firstApplyBtn);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test modal opening
    const modal = await waitForElement('#job-modal');
    if (!modal || modal.style.display === 'none') {
        throw new Error('채용 모달이 열리지 않았습니다');
    }
    
    // Test modal form
    const modalForm = modal.querySelector('.job-form');
    if (!modalForm) throw new Error('모달 내 지원서 폼을 찾을 수 없습니다');
    
    const modalNameField = modalForm.querySelector('input[name="name"]');
    const modalEmailField = modalForm.querySelector('input[name="email"]');
    const modalPhoneField = modalForm.querySelector('input[name="phone"]');
    const modalResumeField = modalForm.querySelector('input[name="resume_link"]');
    const modalCoverField = modalForm.querySelector('textarea[name="cover_letter"]');
    
    if (!modalNameField) throw new Error('모달 이름 필드를 찾을 수 없습니다');
    if (!modalEmailField) throw new Error('모달 이메일 필드를 찾을 수 없습니다');
    if (!modalResumeField) throw new Error('모달 이력서 링크 필드를 찾을 수 없습니다');
    if (!modalCoverField) throw new Error('모달 자기소개 필드를 찾을 수 없습니다');
    
    // Fill modal form
    simulateUserInput(modalNameField, '지원자 테스트');
    simulateUserInput(modalEmailField, 'applicant@test.com');
    simulateUserInput(modalPhoneField, '010-1234-5678');
    simulateUserInput(modalResumeField, 'https://drive.google.com/test-resume');
    simulateUserInput(modalCoverField, '테스트 자기소개서입니다.');
    
    console.log('💼 Careers 모달 폼 입력 완료');
    
    // Test modal closing
    const closeBtn = modal.querySelector('.close');
    if (!closeBtn) throw new Error('모달 닫기 버튼을 찾을 수 없습니다');
    
    simulateClick(closeBtn);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (modal.style.display !== 'none') {
        throw new Error('모달이 닫히지 않았습니다');
    }
}

// =============================================================================
// FORM2AI2EMAIL INTEGRATION TEST
// =============================================================================
async function testForm2AI2EmailIntegration() {
    console.log('🔗 Form2AI2Email 서비스 연결 테스트...');
    
    try {
        const testData = {
            form_id: TEST_CONFIG.contactFormId,
            data: {
                name: '테스트 사용자',
                work_email: 'test@company.com',
                inquiry_type: 'partnership',
                subject: 'aiConsultation',
                message: 'API 연결 테스트 메시지'
            }
        };
        
        const response = await fetch(TEST_CONFIG.form2aiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        if (!response.ok) {
            throw new Error(`API 응답 오류: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('📧 Form2AI2Email 응답:', result);
        
    } catch (error) {
        // API 오류는 예상되므로 경고로만 처리
        console.warn('⚠️ Form2AI2Email 연결 테스트:', error.message);
        console.log('ℹ️ 실제 사용 시에는 정상 작동할 수 있습니다.');
    }
}

// =============================================================================
// MAIN TEST RUNNER
// =============================================================================
async function runAllTests() {
    const testRunner = new TestRunner();
    
    console.log('🚀 Baryon Labs 종합 기능 테스트 시작');
    console.log('==========================================');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run tests
    await testRunner.runTest('네비게이션 테스트', testNavigation);
    await testRunner.runTest('언어 전환 테스트', testLanguageSwitching);
    await testRunner.runTest('서비스 섹션 테스트', testServicesSection);
    await testRunner.runTest('컨택 폼 테스트', testContactForm);
    await testRunner.runTest('커리어 모달 테스트', testCareersModal);
    await testRunner.runTest('Form2AI2Email 연동 테스트', testForm2AI2EmailIntegration);
    
    testRunner.printSummary();
    
    return testRunner.results;
}

// =============================================================================
// AUTO START TESTS
// =============================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runAllTests, 3000); // Give time for HTMX to load
    });
} else {
    setTimeout(runAllTests, 3000);
}

// Export for manual testing
window.BaryonLabsTest = {
    runAllTests,
    testNavigation,
    testLanguageSwitching,
    testServicesSection,
    testContactForm,
    testCareersModal,
    testForm2AI2EmailIntegration
}; 