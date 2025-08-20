// =============================================================================
// BARYON LABS - LANGUAGE SYSTEM
// =============================================================================

// =============================================================================
// LANGUAGE STATE
// =============================================================================
let currentLanguage = localStorage.getItem('language') || 'ko';

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
            services: 'Services',
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
        services: {
            title: 'Our Services',
            subtitle: 'Innovative AI-powered tools and platforms to accelerate your digital transformation',
            visitSite: 'Visit Site',
            miri: {
                title: 'miri.dev',
                description: 'Advanced AI development platform with cutting-edge tools for machine learning researchers and developers',
                feature1: 'AI Development',
                feature2: 'ML Tools',
                feature3: 'Research Platform'
            },
            wwwai: {
                title: 'wwwai.site',
                description: 'Next-generation web AI interface that revolutionizes how users interact with artificial intelligence on the web',
                feature1: 'Web AI',
                feature2: 'User Interface',
                feature3: 'Interactive'
            },
            form2ai: {
                title: 'form2ai2email',
                description: 'Smart form processing service that converts web forms into AI-processed emails with intelligent data extraction',
                feature1: 'Form Processing',
                feature2: 'AI Email',
                feature3: 'Automation'
            },
            nostudyanymore: {
                title: 'nostudyanymore.com',
                description: 'Revolutionary AI-powered learning platform that transforms traditional education through personalized and adaptive learning experiences',
                feature1: 'AI Learning',
                feature2: 'Education',
                feature3: 'Personalized'
            },
            notiondb2backendapi: {
                title: 'notiondb2backendapi',
                description: 'Transform your Notion databases into powerful REST APIs with real-time data synchronization and seamless backend integration',
                feature1: 'API Gateway',
                feature2: 'Data Sync',
                feature3: 'Backend'
            },
            baryonWorkspace: {
                title: 'Baryon Agents Parallel Workspace',
                description: 'Integrated environment for spec-driven parallel agent programming with VS Code extension',
                feature1: 'Parallel Workspace',
                feature2: 'Spec-driven',
                feature3: 'VS Code Extension'
            },
            comingSoon: {
                title: 'New Service Coming Soon',
                description: 'We are developing an innovative AI solution with our new team member. Stay tuned for an amazing service that will be unveiled soon.',
                feature1: 'Teamwork',
                feature2: 'Innovation',
                feature3: 'In Development',
                link: 'Interested?'
            },
            cta: {
                title: 'Ready to Transform Your Business?',
                description: 'Let\'s discuss how our AI services can accelerate your digital transformation',
                button: 'Get Started'
            }
        },
        corporate: {
            title: 'Corporate Custom Training & Hackathons',
            subtitle: 'We offer customized corporate lectures, hackathons and workshops for enterprises. Details will be provided on our blog.'
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
            services: '서비스',
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
        services: {
            title: '우리의 서비스',
            subtitle: '디지털 혁신을 가속화하는 혁신적인 AI 기반 도구와 플랫폼',
            visitSite: '사이트 방문',
            miri: {
                title: 'miri.dev',
                description: '머신러닝 연구자와 개발자를 위한 최첨단 도구를 제공하는 고급 AI 개발 플랫폼',
                feature1: 'AI 개발',
                feature2: 'ML 도구',
                feature3: '연구 플랫폼'
            },
            wwwai: {
                title: 'wwwai.site',
                description: '사용자가 웹에서 인공지능과 상호작용하는 방식을 혁신하는 차세대 웹 AI 인터페이스',
                feature1: '웹 AI',
                feature2: '사용자 인터페이스',
                feature3: '인터랙티브'
            },
            form2ai: {
                title: 'form2ai2email',
                description: '웹 폼을 지능적 데이터 추출과 함께 AI 처리된 이메일로 변환하는 스마트 폼 처리 서비스',
                feature1: '폼 처리',
                feature2: 'AI 이메일',
                feature3: '자동화'
            },
            nostudyanymore: {
                title: 'nostudyanymore.com',
                description: '개인화된 적응형 학습 경험을 통해 전통적인 교육을 변화시키는 혁신적인 AI 기반 학습 플랫폼',
                feature1: 'AI 학습',
                feature2: '교육',
                feature3: '개인화'
            },
            notiondb2backendapi: {
                title: 'notiondb2backendapi',
                description: '노션 데이터베이스를 실시간 데이터 동기화와 원활한 백엔드 통합이 가능한 강력한 REST API로 변환',
                feature1: 'API 게이트웨이',
                feature2: '데이터 동기화',
                feature3: '백엔드'
            },
            baryonWorkspace: {
                title: 'Baryon Agents Parallel Workspace',
                description: '스펙 중심 병렬 에이전트 프로그래밍을 위한 통합 환경으로, VS Code 확장 프로그램을 제공합니다',
                feature1: '병렬 워크스페이스',
                feature2: '스펙 기반',
                feature3: 'VS Code 확장'
            },
            comingSoon: {
                title: '새로운 서비스 준비중',
                description: '새로운 팀원과 함께 혁신적인 AI 솔루션을 개발하고 있습니다. 곧 여러분께 놀라운 서비스를 선보일 예정입니다.',
                feature1: '팀워크',
                feature2: '혁신',
                feature3: '개발중',
                link: '관심 있으신가요?'
            },
            cta: {
                title: '비즈니스 혁신을 준비하셨나요?',
                description: 'AI 서비스가 어떻게 디지털 혁신을 가속화할 수 있는지 논의해보세요',
                button: '시작하기'
            }
        },
        corporate: {
            title: '기업 맞춤 강의 · 해커톤/워크샵',
            subtitle: '기업 맞춤 강의 서비스와 해커톤, 워크샵을 제공합니다. 자세한 내용은 블로그에서 확인하세요.'
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
    window.currentLanguage = lang; // 전역으로도 설정
    localStorage.setItem('language', lang);
    
    // Update body data-lang attribute for CSS styling
    document.body.setAttribute('data-lang', lang);
    
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
    

    
    // 새로운 JSON 기반 시스템에 언어 변경 이벤트 전송
    const languageChangedEvent = new CustomEvent('languageChanged', {
        detail: { language: lang }
    });
    document.dispatchEvent(languageChangedEvent);
}

function initializeLanguageSystem() {
    // Set initial language and body attribute
    window.currentLanguage = currentLanguage; // 전역으로도 설정
    document.body.setAttribute('data-lang', currentLanguage);
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