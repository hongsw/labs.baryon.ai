// =============================================================================
// BARYON LABS - LANGUAGE SYSTEM
// =============================================================================

// =============================================================================
// LANGUAGE STATE
// =============================================================================
let currentLanguage = localStorage.getItem('language') || 'en';

// =============================================================================
// TRANSLATIONS DATA
// =============================================================================
const translations = {
    en: {
        nav: {
            home: 'Home',
            concept: 'Concept',
            philosophy: 'Philosophy',
            team: 'Team',
            careers: 'Careers',
            contact: 'Contact'
        },
        hero: {
            subtitle: 'AI from First Principles',
            description: 'Like baryons forming matter\'s foundation,<br>we build revolutionary AI from core elements.',
            cta: 'Explore Vision'
        },
        concept: {
            title: 'Fundamental Architecture',
            atomic: {
                title: 'Atomic Components',
                description: 'Core algorithms and data structures forming the foundation of scalable AI systems.'
            },
            neural: {
                title: 'Neural Composition',
                description: 'Attention mechanisms and transformer architectures enabling emergent intelligence.'
            },
            quantum: {
                title: 'Quantum Leap',
                description: 'Revolutionary breakthroughs through foundational principle combinations.'
            }
        },
        vision: {
            title: 'AI Architecture',
            attention: {
                title: 'Attention Mechanisms',
                description: 'Self-attention and cross-attention layers enabling context understanding.'
            },
            optimization: {
                title: 'Group Optimization',
                description: 'Policy gradient methods and reinforcement learning for adaptive behavior.'
            },
            intelligence: {
                title: 'Emergent Intelligence',
                description: 'Complex behaviors arising from simple component interactions.'
            }
        },
        philosophy: {
            title: 'Core Philosophy',
            content: '"Three quarks form a baryon, baryons create nuclei, atoms bond into elements. We start with AI\'s fundamental building blocks and compose transformative technologies."'
        },
        team: {
            title: 'Our Team'
        },
        careers: {
            title: 'Join Our Team',
            subtitle: 'Building the future of AI from first principles'
        },
        contact: {
            title: 'Contact Us',
            name: 'Name *',
            namePlaceholder: 'Your name',
            workEmail: 'Work Email *',
            emailPlaceholder: 'your@company.com',
            inquiryType: 'Inquiry Type *',
            selectInquiry: 'Select inquiry type',
            partnership: 'Partnership',
            investment: 'Investment',
            collaboration: 'Collaboration',
            consulting: 'Consulting',
            general: 'General Inquiry',
            support: 'Technical Support',
            subject: 'Subject *',
            selectSubject: 'Select subject',
            aiConsultation: 'AI Strategy Consultation',
            partnershipProposal: 'Partnership Proposal',
            investmentDiscussion: 'Investment Discussion',
            technicalCollaboration: 'Technical Collaboration',
            productDevelopment: 'Product Development',
            researchPartnership: 'Research Partnership',
            businessInquiry: 'Business Inquiry',
            other: 'Other',
            message: 'Message *',
            messagePlaceholder: 'Tell us about your project or inquiry...',
            addOptional: '+ Add Optional Details',
            hideOptional: '- Hide Optional Details',
            phone: 'Phone',
            phonePlaceholder: '+1 (555) 123-4567',
            company: 'Company',
            companyPlaceholder: 'Your company',
            sendMessage: 'Send Message'
        },
        footer: {
            copyright: '© 2025 Baryon Labs. AI Innovation from the Ground Up.'
        }
    },
    ko: {
        nav: {
            home: '홈',
            concept: '컨셉트',
            philosophy: '철학',
            team: '팀',
            careers: '채용',
            contact: '연락처'
        },
        hero: {
            subtitle: '첫 번째 원리에서 시작하는 AI',
            description: '바리온이 물질의 기초를 형성하듯,<br>우리는 핵심 요소로부터 혁신적인 AI를 구축합니다.',
            cta: '비전 탐색'
        },
        concept: {
            title: '기본 아키텍처',
            atomic: {
                title: '원자 구성요소',
                description: '확장 가능한 AI 시스템의 기초를 형성하는 핵심 알고리즘과 데이터 구조입니다.'
            },
            neural: {
                title: '신경망 조합',
                description: '창발적 지능을 가능하게 하는 어텐션 메커니즘과 트랜스포머 아키텍처입니다.'
            },
            quantum: {
                title: '양자도약',
                description: '기본 원리 조합을 통한 혁신적인 돌파구입니다.'
            }
        },
        vision: {
            title: 'AI 아키텍처',
            attention: {
                title: '어텐션 메커니즘',
                description: '컨텍스트 이해를 가능하게 하는 셀프-어텐션 및 크로스-어텐션 레이어입니다.'
            },
            optimization: {
                title: '그룹 최적화',
                description: '적응적 행동을 위한 정책 그래디언트 방법과 강화학습입니다.'
            },
            intelligence: {
                title: '창발적 지능',
                description: '단순한 구성요소 상호작용에서 나타나는 복잡한 행동입니다.'
            }
        },
        philosophy: {
            title: '핵심 철학',
            content: '"세 개의 쿼크가 바리온을 형성하고, 바리온이 핵을 만들며, 원자가 원소로 결합됩니다. 우리는 AI의 기본 구성 요소부터 시작하여 혁신적인 기술을 구성합니다."'
        },
        team: {
            title: '우리 팀'
        },
        careers: {
            title: '팀에 합류하세요',
            subtitle: '첫 번째 원리에서 시작하는 AI의 미래를 구축합니다'
        },
        contact: {
            title: '연락하기',
            name: '이름 *',
            namePlaceholder: '이름을 입력하세요',
            workEmail: '회사 이메일 *',
            emailPlaceholder: 'your@company.com',
            inquiryType: '문의 유형 *',
            selectInquiry: '문의 유형을 선택하세요',
            partnership: '파트너십',
            investment: '투자',
            collaboration: '협업',
            consulting: '컨설팅',
            general: '일반 문의',
            support: '기술 지원',
            subject: '주제 *',
            selectSubject: '주제를 선택하세요',
            aiConsultation: 'AI 전략 컨설팅',
            partnershipProposal: '파트너십 제안',
            investmentDiscussion: '투자 논의',
            technicalCollaboration: '기술 협업',
            productDevelopment: '제품 개발',
            researchPartnership: '연구 파트너십',
            businessInquiry: '비즈니스 문의',
            other: '기타',
            message: '메시지 *',
            messagePlaceholder: '프로젝트나 문의 사항에 대해 알려주세요...',
            addOptional: '+ 추가 정보 입력',
            hideOptional: '- 추가 정보 숨기기',
            phone: '전화번호',
            phonePlaceholder: '+82 10-1234-5678',
            company: '회사',
            companyPlaceholder: '회사명',
            sendMessage: '메시지 보내기'
        },
        footer: {
            copyright: '© 2025 Baryon Labs. 기초부터 시작하는 AI 혁신.'
        }
    }
};

// =============================================================================
// LANGUAGE SYSTEM FUNCTIONS
// =============================================================================
function translateElement(element, key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        value = value?.[k];
    }
    
    if (value) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.type === 'text' || element.type === 'email' || element.type === 'tel' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            }
        } else {
            element.innerHTML = value;
        }
    }
}

function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        translateElement(element, key);
    });
    
    // Translate placeholder elements
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        translateElement(element, key);
    });
    
    // Update toggle button text based on state
    const toggleBtn = document.getElementById('toggleOptional');
    const optionalFields = document.getElementById('optionalFields');
    if (toggleBtn) {
        const isExpanded = optionalFields?.classList.contains('expanded');
        const key = isExpanded ? 'contact.hideOptional' : 'contact.addOptional';
        translateElement(toggleBtn, key);
    }
    
    // 새로운 JSON 기반 시스템에 언어 변경 이벤트 전송
    const languageChangedEvent = new CustomEvent('languageChanged', {
        detail: { language: lang }
    });
    document.dispatchEvent(languageChangedEvent);
}

function initializeLanguageSystem() {
    // Set initial language
    switchLanguage(currentLanguage);
    
    // Add event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });
}

// =============================================================================
// HTMX INTEGRATION
// =============================================================================
// Apply translations when new content is loaded via HTMX
document.addEventListener('htmx:afterSettle', function(event) {
    // Re-apply translations to newly loaded content
    event.detail.elt.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        translateElement(element, key);
    });
    
    event.detail.elt.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        translateElement(element, key);
    });
    
    // JSON 기반 섹션들이 로드될 때 언어 변경 이벤트 재전송
    const languageChangedEvent = new CustomEvent('languageChanged', {
        detail: { language: currentLanguage }
    });
    document.dispatchEvent(languageChangedEvent);
});

// =============================================================================
// EXPORTS
// =============================================================================
window.switchLanguage = switchLanguage;
window.initializeLanguageSystem = initializeLanguageSystem; 