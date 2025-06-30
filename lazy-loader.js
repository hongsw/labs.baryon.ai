/**
 * Baryon Labs - 순수 JavaScript 섹션 Lazy Loader
 * Python 서버 없이 file:// 프로토콜에서도 동작합니다
 */

class SectionLoader {
    constructor() {
        this.loadedSections = new Set();
        this.init();
    }

    init() {
        // 페이지 로드 시 Home 섹션 즉시 표시
        this.loadSection('home');
        
        // Intersection Observer 설정
        this.setupIntersectionObserver();
        
        // 네비게이션 클릭 이벤트 설정
        this.setupNavigationEvents();
        
        console.log('🚀 Baryon Labs Lazy Loader 초기화 완료');
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id.replace('-container', '');
                    this.loadSection(sectionId);
                }
            });
        }, options);

        // 각 섹션 컨테이너 관찰
        const containers = ['concept-container', 'team-container', 'careers-container', 'contact-container'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                observer.observe(container);
            }
        });
    }

    setupNavigationEvents() {
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                
                // 즉시 로드
                if (targetId !== 'home') {
                    this.loadSection(targetId);
                }
                
                // 부드러운 스크롤
                setTimeout(() => {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            });
        });
    }

    async loadSection(sectionName) {
        if (this.loadedSections.has(sectionName)) {
            console.log(`✅ ${sectionName} 섹션 이미 로드됨`);
            return;
        }

        try {
            console.log(`🔄 ${sectionName} 섹션 로딩 중...`);
            
            // 각 섹션별 콘텐츠 정의
            const sectionContent = this.getSectionContent(sectionName);
            
            if (sectionContent) {
                this.renderSection(sectionName, sectionContent);
                this.loadedSections.add(sectionName);
                console.log(`✅ ${sectionName} 섹션 로드 완료`);
                
                // 섹션별 후처리
                this.postProcessSection(sectionName);
            }
        } catch (error) {
            console.error(`❌ ${sectionName} 섹션 로드 실패:`, error);
        }
    }

    getSectionContent(sectionName) {
        // 각 섹션의 내용을 직접 정의 (file:// 프로토콜에서도 동작)
        const sections = {
            home: `
                <section id="home" class="hero">
                    <div class="hero-bg">
                        <svg id="d3-background"></svg>
                    </div>
                    <div class="hero-content">
                        <h1>Baryon Labs</h1>
                        <div class="subtitle" data-i18n="hero.subtitle">AI from First Principles</div>
                        <p class="description" data-i18n="hero.description">
                            Like baryons forming matter's foundation,<br>
                            we build revolutionary AI from core elements.
                        </p>
                        <a href="#concept" class="cta-button">
                            <span data-i18n="hero.cta">Explore Vision</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9,18 15,12 9,6"></polyline>
                            </svg>
                        </a>
                    </div>
                </section>
            `,
            
            concept: `
                <section id="concept" class="section">
                    <div class="container">
                        <h2 class="section-title" data-i18n="concept.title">Fundamental Architecture</h2>
                        
                        <div class="concept-grid">
                            <div class="concept-card">
                                <svg class="concept-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <circle cx="12" cy="12" r="3"/>
                                    <path d="M20.2 8.4A8 8 0 0 0 3.8 8.4"/>
                                    <path d="M20.2 15.6A8 8 0 0 1 3.8 15.6"/>
                                    <circle cx="12" cy="12" r="1"/>
                                </svg>
                                <h3 data-i18n="concept.atomic.title">Atomic Components</h3>
                                <p data-i18n="concept.atomic.description">Core algorithms and data structures forming the foundation of scalable AI systems.</p>
                            </div>
                            
                            <div class="concept-card">
                                <svg class="concept-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                                </svg>
                                <h3 data-i18n="concept.neural.title">Neural Composition</h3>
                                <p data-i18n="concept.neural.description">Attention mechanisms and transformer architectures enabling emergent intelligence.</p>
                            </div>
                            
                            <div class="concept-card">
                                <svg class="concept-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5"/>
                                    <path d="M2 12l10 5 10-5"/>
                                </svg>
                                <h3 data-i18n="concept.quantum.title">Quantum Leap</h3>
                                <p data-i18n="concept.quantum.description">Revolutionary breakthroughs through foundational principle combinations.</p>
                            </div>
                        </div>

                        <div class="vision-section">
                            <h2 class="section-title" style="margin-bottom: 20px;" data-i18n="vision.title">AI Architecture</h2>
                            <div class="vision-grid">
                                <div class="vision-item">
                                    <h4 data-i18n="vision.attention.title">Attention Mechanisms</h4>
                                    <p data-i18n="vision.attention.description">Self-attention and cross-attention layers enabling context understanding.</p>
                                </div>
                                <div class="vision-item">
                                    <h4 data-i18n="vision.optimization.title">Group Optimization</h4>
                                    <p data-i18n="vision.optimization.description">Policy gradient methods and reinforcement learning for adaptive behavior.</p>
                                </div>
                                <div class="vision-item">
                                    <h4 data-i18n="vision.intelligence.title">Emergent Intelligence</h4>
                                    <p data-i18n="vision.intelligence.description">Complex behaviors arising from simple component interactions.</p>
                                </div>
                            </div>
                        </div>

                        <div class="philosophy">
                            <div class="philosophy-bg">
                                <svg id="d3-philosophy-background"></svg>
                            </div>
                            <div class="philosophy-content">
                                <h2 data-i18n="philosophy.title">Core Philosophy</h2>
                                <p data-i18n="philosophy.content">
                                    "Three quarks form a baryon, baryons create nuclei, atoms bond into elements. 
                                    We start with AI's fundamental building blocks and compose transformative technologies."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            
            team: `
                <section id="team" class="team-section">
                    <div class="container">
                        <h2 class="section-title" data-i18n="team.title">Our Team</h2>
                        
                        <div class="team-grid">
                            <div class="team-member">
                                <svg class="baryon-background" id="baryon-1"></svg>
                                <div class="member-avatar">
                                    <img src="101.png" alt="Jong Pow" onerror="this.style.display='none'; this.parentNode.innerHTML='JP';">
                                </div>
                                <h3 class="member-name">Jean Paul</h3>
                                <p class="member-role">AI Master & First Learner</p>
                                <div class="member-social">
                                    <a href="https://www.linkedin.com/in/martin-hong-sw/?ref=nostudyanymore.com" class="member-social-link" target="_blank" rel="noopener noreferrer" title="LinkedIn Profile">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            
                            <div class="team-member">
                                <svg class="baryon-background" id="baryon-2"></svg>
                                <div class="member-avatar">
                                    <img src="2.jpeg" alt="H. Jeung" onerror="this.style.display='none'; this.parentNode.innerHTML='HJ';">
                                </div>
                                <h3 class="member-name">H. Jeung</h3>
                                <p class="member-role">CMO and Offline Master</p>
                            </div>
                            
                            <div class="team-member">
                                <svg class="baryon-background" id="baryon-3"></svg>
                                <div class="member-avatar placeholder">
                                    Coming Soon
                                </div>
                                <h3 class="member-name">TBA</h3>
                                <p class="member-role">Full Stack and Mobile<br>First Learner</p>
                            </div>
                            
                            <div class="team-member">
                                <svg class="baryon-background" id="baryon-4"></svg>
                                <div class="member-avatar placeholder">
                                    Coming Soon
                                </div>
                                <h3 class="member-name">TBA</h3>
                                <p class="member-role">N8N Master & AI Ops<br>First Learner</p>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            
            careers: `
                <section id="careers" class="careers-section">
                    <div class="careers-container">
                        <h2 class="section-title" data-i18n="careers.title">Join Our Team</h2>
                        
                        <div class="career-intro">
                            <p data-i18n="careers.intro">
                                Like fundamental particles coming together to create matter, exceptional individuals join us to build transformative AI technologies. 
                                We seek first-principle thinkers who can architect the future of artificial intelligence.
                            </p>
                        </div>

                        <div class="jobs-grid" id="jobsGrid">
                            <!-- Job cards will be dynamically populated -->
                        </div>
                    </div>
                </section>

                <!-- Job Detail Modal -->
                <div class="job-modal" id="jobModal">
                    <div class="job-modal-content">
                        <div class="job-modal-header">
                            <div>
                                <h3 class="job-modal-title" id="modalJobTitle"></h3>
                                <div class="job-department" id="modalJobDepartment"></div>
                                <div class="job-type" id="modalJobType"></div>
                            </div>
                            <button class="close-modal" id="closeModal">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <div class="job-modal-section">
                            <h4 data-i18n="careers.modal.description">Job Description</h4>
                            <p id="modalJobDescription"></p>
                        </div>

                        <div class="job-modal-section">
                            <h4 data-i18n="careers.modal.responsibilities">Key Responsibilities</h4>
                            <ul id="modalJobResponsibilities"></ul>
                        </div>

                        <div class="job-modal-section">
                            <h4 data-i18n="careers.modal.requirements">Requirements</h4>
                            <ul id="modalJobRequirements"></ul>
                        </div>

                        <div class="job-modal-section">
                            <h4 data-i18n="careers.modal.benefits">What We Offer</h4>
                            <ul id="modalJobBenefits"></ul>
                        </div>

                        <div class="application-form">
                            <h4 data-i18n="careers.apply.title">Apply for this Position</h4>
                            
                            <form id="applicationForm">
                                <input type="hidden" id="appliedPosition" name="position">
                                
                                <div class="app-form-grid">
                                    <div class="app-form-group">
                                        <label class="app-form-label" for="app-name">
                                            <span data-i18n="careers.apply.name">이름</span> <span class="required">*</span>
                                        </label>
                                        <input type="text" id="app-name" name="name" class="app-form-input" data-i18n-placeholder="careers.apply.namePlaceholder" placeholder="홍길동" required>
                                    </div>
                                    
                                    <div class="app-form-group">
                                        <label class="app-form-label" for="app-email">
                                            <span data-i18n="careers.apply.email">이메일</span> <span class="required">*</span>
                                        </label>
                                        <input type="email" id="app-email" name="email" class="app-form-input" data-i18n-placeholder="careers.apply.emailPlaceholder" placeholder="your@email.com" required>
                                    </div>
                                    
                                    <div class="app-form-group">
                                        <label class="app-form-label" for="app-phone">
                                            <span data-i18n="careers.apply.phone">전화번호</span> <span class="required">*</span>
                                        </label>
                                        <input type="tel" id="app-phone" name="phone" class="app-form-input" data-i18n-placeholder="careers.apply.phonePlaceholder" placeholder="010-1234-5678" required>
                                    </div>
                                    
                                    <div class="app-form-group">
                                        <label class="app-form-label" for="app-experience">
                                            <span data-i18n="careers.apply.experience">경력</span>
                                        </label>
                                        <select id="app-experience" name="experience" class="app-form-select">
                                            <option value="" data-i18n="careers.apply.selectExperience">경력을 선택하세요</option>
                                            <option value="0-1" data-i18n="careers.apply.experience01">신입 - 1년</option>
                                            <option value="2-3" data-i18n="careers.apply.experience23">2-3년</option>
                                            <option value="4-6" data-i18n="careers.apply.experience46">4-6년</option>
                                            <option value="7+" data-i18n="careers.apply.experience7plus">7년 이상</option>
                                        </select>
                                    </div>
                                    
                                    <div class="app-form-group full-width">
                                        <label class="app-form-label" for="app-resume">
                                            <span data-i18n="careers.apply.resume">이력서/포트폴리오 링크</span> <span class="required">*</span>
                                        </label>
                                        <input type="url" id="app-resume" name="resume_link" class="app-form-input" data-i18n-placeholder="careers.apply.resumePlaceholder" placeholder="구글 드라이브, GitHub 등의 링크를 입력해주세요" required>
                                    </div>
                                    
                                    <div class="app-form-group full-width">
                                        <label class="app-form-label" for="app-cover-letter">
                                            <span data-i18n="careers.apply.coverLetter">자기소개 및 지원동기</span> <span class="required">*</span>
                                        </label>
                                        <textarea id="app-cover-letter" name="cover_letter" class="app-form-textarea" data-i18n-placeholder="careers.apply.coverLetterPlaceholder" placeholder="본인을 소개하고 지원동기를 작성해주세요..." required></textarea>
                                    </div>
                                </div>
                                
                                <button type="submit" class="app-form-submit" id="applicationSubmitBtn">
                                    <span data-i18n="careers.apply.submit">지원하기</span>
                                </button>
                                
                                <div class="app-form-message" id="applicationMessage"></div>
                            </form>
                        </div>
                    </div>
                </div>
            `,
            
            contact: `
                <section id="contact" class="contact-section">
                    <div class="contact-container">
                        <h2 class="section-title" data-i18n="contact.title">Contact Us</h2>
                        
                        <form class="contact-form" id="contactForm">
                            <!-- 기존 contact form HTML을 여기에 복사 -->
                            <div class="form-grid required">
                                <div class="form-group">
                                    <label class="form-label" for="name" data-i18n="contact.name">Name *</label>
                                    <input type="text" id="name" name="name" class="form-input required-field" data-i18n-placeholder="contact.namePlaceholder" placeholder="Your name" required>
                                    <div class="form-error" id="nameError"></div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label" for="email" data-i18n="contact.workEmail">Work Email *</label>
                                    <input type="email" id="work_email" name="work_email" class="form-input required-field" data-i18n-placeholder="contact.emailPlaceholder" placeholder="your@company.com" required>
                                    <div class="form-error" id="work_emailError"></div>
                                </div>
                                
                                <!-- 나머지 contact form 필드들... -->
                            </div>
                            
                            <button type="submit" class="form-submit" id="submitBtn">
                                <span class="loading-spinner"></span>
                                <span data-i18n="contact.sendMessage">Send Message</span>
                            </button>
                            
                            <div class="form-message" id="formMessage"></div>
                        </form>
                    </div>
                </section>
            `
        };

        return sections[sectionName] || null;
    }

    renderSection(sectionName, content) {
        const containerId = sectionName === 'home' ? 'home-container' : `${sectionName}-container`;
        const container = document.getElementById(containerId);
        
        if (container) {
            container.innerHTML = content;
            
            // 부드러운 나타나기 효과
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                container.style.transition = 'all 0.5s ease-out';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            });
        }
    }

    postProcessSection(sectionName) {
        // 섹션별 후처리 로직
        switch (sectionName) {
            case 'home':
                // D3 백그라운드 애니메이션 초기화
                if (typeof createD3Background === 'function') {
                    createD3Background('#d3-background', '.hero');
                }
                break;
                
            case 'concept':
                // Philosophy 백그라운드 초기화
                if (typeof createD3Background === 'function') {
                    createD3Background('#d3-philosophy-background', '.philosophy');
                }
                break;
                
            case 'team':
                // 팀 멤버 바이온 백그라운드 초기화
                ['baryon-1', 'baryon-2', 'baryon-3', 'baryon-4'].forEach(id => {
                    if (typeof createBaryonAnimation === 'function') {
                        createBaryonAnimation(`#${id}`);
                    }
                });
                break;
                
            case 'careers':
                // 채용 관련 JavaScript 초기화
                if (typeof initCareersSection === 'function') {
                    initCareersSection();
                }
                break;
                
            case 'contact':
                // 연락처 폼 초기화
                if (typeof initContactForm === 'function') {
                    initContactForm();
                }
                break;
        }
    }
}

// 페이지 로드 시 SectionLoader 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.sectionLoader = new SectionLoader();
});

console.log('📦 Baryon Labs Lazy Loader 스크립트 로드됨'); 