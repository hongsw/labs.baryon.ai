// =============================================================================
// BARYON LABS - MAIN JAVASCRIPT
// =============================================================================

// =============================================================================
// GLOBAL VARIABLES AND CONFIGURATION
// =============================================================================
let currentLanguage = localStorage.getItem('language') || 'en';
let heroBackground = null;
let philosophyBackground = null;

// =============================================================================
// SMOOTH SCROLLING AND NAVIGATION
// =============================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =============================================================================
// ENHANCED HEADER SCROLL EFFECTS AND SECTION LOADING
// =============================================================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        header.style.background = 'rgba(10, 14, 39, 0.95)';
        header.style.borderBottom = '1px solid rgba(59, 130, 246, 0.2)';
    } else {
        header.style.background = 'rgba(10, 14, 39, 0.85)';
        header.style.borderBottom = '1px solid rgba(59, 130, 246, 0.1)';
    }

    // Progressive section loading based on scroll position
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercent = scrolled / (documentHeight - windowHeight);

    // Load sections progressively
    if (scrollPercent > 0.1 && !document.querySelector('#concept-container').hasChildNodes()) {
        document.querySelector('#concept-container').style.display = 'block';
        htmx.trigger('#concept-container', 'revealed');
    }
    
    if (scrollPercent > 0.3 && !document.querySelector('#team-container').hasChildNodes()) {
        document.querySelector('#team-container').style.display = 'block';
        htmx.trigger('#team-container', 'revealed');
    }
    
    if (scrollPercent > 0.5 && !document.querySelector('#careers-container').hasChildNodes()) {
        document.querySelector('#careers-container').style.display = 'block';
        htmx.trigger('#careers-container', 'revealed');
    }
    
    if (scrollPercent > 0.7 && !document.querySelector('#contact-container').hasChildNodes()) {
        document.querySelector('#contact-container').style.display = 'block';
        htmx.trigger('#contact-container', 'revealed');
    }

    // Update D3 backgrounds
    if (heroBackground && heroBackground.updateFromScroll) {
        heroBackground.updateFromScroll(scrolled);
    }
    if (philosophyBackground && philosophyBackground.updateFromScroll) {
        philosophyBackground.updateFromScroll(scrolled);
    }
});

// =============================================================================
// D3.JS ADVANCED NEURAL NETWORK BACKGROUND
// =============================================================================
function createD3Background(svgId, containerSelector, nodeCount = 15, nodeSize = 3) {
    const svg = d3.select(svgId);
    const containerSection = document.querySelector(containerSelector);
    
    if (!containerSection) return null;
    
    function updateDimensions() {
        const rect = containerSection.getBoundingClientRect();
        svg.attr('width', rect.width).attr('height', rect.height);
        return { width: rect.width, height: rect.height };
    }
    
    let { width, height } = updateDimensions();
    let mouseX = width / 2, mouseY = height / 2;
    
    // Network data with enhanced properties (optimized for performance)
    const nodes = Array.from({length: nodeCount}, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: (Math.random() * 4 + 1) * nodeSize,
        energy: Math.random(),
        layer: Math.floor(Math.random() * 4) + 1,
        cluster: Math.floor(Math.random() * 5),
        importance: Math.random(),
        pulsePhase: Math.random() * Math.PI * 2
    }));
    
    // Create advanced gradients and filters
    const defs = svg.append('defs');
    
    // Glow filter
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    
    // Multiple gradients for variety
    const gradients = [
        { id: 'gradient1', colors: ['#06B6D4', '#3B82F6'] },
        { id: 'gradient2', colors: ['#3B82F6', '#8B5CF6'] },
        { id: 'gradient3', colors: ['#06B6D4', '#10B981'] },
        { id: 'gradient4', colors: ['#F59E0B', '#EF4444'] }
    ];
    
    gradients.forEach(grad => {
        const gradient = defs.append('radialGradient')
            .attr('id', grad.id)
            .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', grad.colors[0]).attr('stop-opacity', 0.9);
        gradient.append('stop').attr('offset', '100%').attr('stop-color', grad.colors[1]).attr('stop-opacity', 0.1);
    });
    
    // Background trails for data flow
    const trailGroup = svg.append('g').attr('class', 'trails');
    const linkGroup = svg.append('g').attr('class', 'links');
    const nodeGroup = svg.append('g').attr('class', 'nodes');
    const hubGroup = svg.append('g').attr('class', 'hubs');
    
    // Data flow particles
    const dataFlows = [];
    
    function createDataFlow(source, target) {
        const colors = ['#06B6D4', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];
        return {
            x: source.x,
            y: source.y,
            targetX: target.x,
            targetY: target.y,
            progress: 0,
            speed: 0.025 + Math.random() * 0.04,
            size: (Math.random() * 2 + 1) * nodeSize,
            life: 1.0,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }
    
    // Mouse interaction
    svg.on('mousemove', function(event) {
        [mouseX, mouseY] = d3.pointer(event);
        
        // Attract nearby nodes to mouse (optimized range)
        nodes.forEach(node => {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100 * 0.02;
                node.vx += dx / distance * force;
                node.vy += dy / distance * force;
            }
        });
    });
    
    function updateNetwork() {
        const time = Date.now() * 0.001;
        
        // Update nodes with enhanced physics
        nodes.forEach((node, i) => {
            // Basic movement
            node.x += node.vx;
            node.y += node.vy;
            
            // Cluster behavior (optimized)
            nodes.forEach(other => {
                if (other.id !== node.id && other.cluster === node.cluster) {
                    const dx = other.x - node.x;
                    const dy = other.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0 && distance < 60) {
                        const force = 0.001;
                        node.vx += dx / distance * force;
                        node.vy += dy / distance * force;
                    }
                }
            });
            
            // Boundary physics with damping
            if (node.x < 0 || node.x > width) {
                node.vx *= -0.8;
                node.x = Math.max(0, Math.min(width, node.x));
            }
            if (node.y < 0 || node.y > height) {
                node.vy *= -0.8;
                node.y = Math.max(0, Math.min(height, node.y));
            }
            
            // Apply friction
            node.vx *= 0.995;
            node.vy *= 0.995;
            
            // Energy and pulse updates
            node.energy += 0.015 + node.importance * 0.01;
            node.pulsePhase += 0.1;
            if (node.energy > 1) node.energy = 0;
        });
        
        // Generate connections with intelligence (optimized distance)
        const connections = [];
        const maxDistance = 80;
        const hubs = nodes.filter(n => n.importance > 0.7);
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                let shouldConnect = false;
                let connectionStrength = 0;
                
                // Same cluster connection
                if (nodes[i].cluster === nodes[j].cluster && distance < maxDistance * 0.8) {
                    shouldConnect = true;
                    connectionStrength = 0.8;
                }
                
                // Hub connections
                if ((nodes[i].importance > 0.6 || nodes[j].importance > 0.6) && distance < maxDistance) {
                    shouldConnect = true;
                    connectionStrength = Math.max(connectionStrength, 0.6);
                }
                
                // Regular proximity
                if (distance < maxDistance * 0.6) {
                    shouldConnect = true;
                    connectionStrength = Math.max(connectionStrength, 0.4);
                }
                
                if (shouldConnect) {
                    const opacity = (maxDistance - distance) / maxDistance * connectionStrength;
                    connections.push({
                        source: nodes[i],
                        target: nodes[j],
                        distance: distance,
                        opacity: opacity,
                        strength: connectionStrength
                    });
                    
                    // Create data flows more frequently for enhanced communication
                    let flowProbability = 0.025;
                    
                    // Increase flow probability for same cluster nodes
                    if (nodes[i].cluster === nodes[j].cluster) {
                        flowProbability = 0.045;
                    }
                    
                    // Increase flow probability for hub connections
                    if (nodes[i].importance > 0.7 || nodes[j].importance > 0.7) {
                        flowProbability *= 1.5;
                    }
                    
                    if (Math.random() < flowProbability && connectionStrength > 0.3) {
                        dataFlows.push(createDataFlow(nodes[i], nodes[j]));
                    }
                }
            }
        }
        
        // Update data flows
        dataFlows.forEach((flow, index) => {
            flow.progress += flow.speed;
            flow.life -= 0.015;
            
            if (flow.progress >= 1 || flow.life <= 0) {
                dataFlows.splice(index, 1);
                return;
            }
            
            flow.x = flow.x + (flow.targetX - flow.x) * flow.progress;
            flow.y = flow.y + (flow.targetY - flow.y) * flow.progress;
        });
        
        // Update trails
        const trails = trailGroup.selectAll('circle').data(dataFlows);
        
        trails.enter()
            .append('circle')
            .merge(trails)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.size)
            .attr('fill', d => d.color)
            .attr('opacity', d => d.life * 0.9)
            .attr('filter', 'url(#glow)');
        
        trails.exit().remove();
        
        // Update links with enhanced visuals
        const links = linkGroup.selectAll('line').data(connections);
        
        links.enter()
            .append('line')
            .merge(links)
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .attr('stroke', d => d.strength > 0.6 ? '#06B6D4' : '#3B82F6')
            .attr('stroke-width', d => d.opacity * (1 + d.strength) * nodeSize)
            .attr('stroke-opacity', d => d.opacity * 0.4)
            .attr('stroke-dasharray', d => d.strength > 0.7 ? `${5 * nodeSize},${5 * nodeSize}` : 'none');
        
        links.exit().remove();
        
        // Update nodes with advanced visuals
        const nodeElements = nodeGroup.selectAll('circle').data(nodes);
        
        nodeElements.enter()
            .append('circle')
            .merge(nodeElements)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => {
                const baseSize = d.radius + Math.sin(d.pulsePhase) * (0.5 * nodeSize);
                return d.importance > 0.7 ? baseSize * 1.5 : baseSize;
            })
            .attr('fill', d => `url(#gradient${d.layer})`)
            .attr('opacity', d => 0.3 + Math.sin(d.energy * Math.PI * 2) * 0.4 + d.importance * 0.3)
            .attr('filter', d => d.importance > 0.6 ? 'url(#glow)' : 'none');
        
        nodeElements.exit().remove();
        
        // Update hubs with special effects
        const hubElements = hubGroup.selectAll('circle').data(hubs);
        
        hubElements.enter()
            .append('circle')
            .merge(hubElements)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.radius * 2 + Math.sin(time * 2 + d.pulsePhase) * (2 * nodeSize))
            .attr('fill', 'none')
            .attr('stroke', '#06B6D4')
            .attr('stroke-width', 2 * nodeSize)
            .attr('stroke-opacity', d => 0.3 + Math.sin(time + d.pulsePhase) * 0.2)
            .attr('filter', 'url(#glow)');
        
        hubElements.exit().remove();
    }
    
    // Enhanced animation loop
    function animate() {
        updateNetwork();
        requestAnimationFrame(animate);
    }
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        const newDimensions = updateDimensions();
        width = newDimensions.width;
        height = newDimensions.height;
        
        nodes.forEach(node => {
            node.x = Math.min(node.x, width);
            node.y = Math.min(node.y, height);
        });
    });
    
    // Return scroll update function for external management
    return {
        updateFromScroll: (scrolled) => {
            const scrollFactor = scrolled * 0.0008;
            
            nodes.forEach(node => {
                const wave = Math.sin(scrolled * 0.01 + node.id * 0.1) * scrollFactor;
                node.vx += wave;
                node.vy += wave * 0.5;
                node.vx = Math.max(-3, Math.min(3, node.vx));
                node.vy = Math.max(-3, Math.min(3, node.vy));
            });
        }
    };
}

// =============================================================================
// OPTIMIZED 3D POLYHEDRON ANIMATION FOR TEAM CARDS
// =============================================================================
function initBaryonParticles() {
    const baryonConfigs = [
        { 
            id: 'baryon-1', 
            type: 'hexagon',
            color: '#3B82F6',
            rotation: 0.015
        },
        { 
            id: 'baryon-2', 
            type: 'octahedron',
            color: '#06B6D4',
            rotation: -0.012
        },
        { 
            id: 'baryon-3', 
            type: 'cube',
            color: '#8B5CF6',
            rotation: 0.018
        },
        { 
            id: 'baryon-4', 
            type: 'tetrahedron',
            color: '#10B981',
            rotation: -0.020
        }
    ];

    baryonConfigs.forEach((config, index) => {
        const svg = d3.select(`#${config.id}`);
        
        if (!svg.node()) return;
        
        svg.attr('width', '100%')
           .attr('height', '100%')
           .attr('viewBox', '0 0 200 200');

        const centerX = 100;
        const centerY = 100;

        // 간단한 그라디언트 설정
        const defs = svg.append('defs');
        
        // 간단한 그라디언트
        const gradient = defs.append('radialGradient')
            .attr('id', `gradient-${config.id}`)
            .attr('cx', '30%').attr('cy', '30%').attr('r', '70%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', d3.color(config.color).brighter(1))
            .attr('stop-opacity', 0.8);
            
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', d3.color(config.color).darker(1))
            .attr('stop-opacity', 0.3);

        let rotation = 0;

        // 간단한 다면체 생성
        function createPolyhedron(type) {
            const group = svg.append('g')
                .attr('transform', `translate(${centerX}, ${centerY})`);

            switch(type) {
                case 'hexagon':
                    // 6각형 (6개 면)
                    for (let i = 0; i < 6; i++) {
                        const angle = (i * 60) * Math.PI / 180;
                        const x = Math.cos(angle) * 30;
                        const y = Math.sin(angle) * 30;
                        
                        group.append('polygon')
                            .attr('points', `0,0 ${x},${y} ${Math.cos((i+1)*60*Math.PI/180)*30},${Math.sin((i+1)*60*Math.PI/180)*30}`)
                            .attr('fill', `url(#gradient-${config.id})`)
                            .attr('stroke', config.color)
                            .attr('stroke-width', 0.5)
                            .attr('opacity', 0.6);
                    }
                    break;
                    
                case 'octahedron':
                    // 8면체 (8개 면)
                    const faces = [
                        [[0,-40], [30,0], [0,0]],
                        [[0,-40], [0,0], [-30,0]],
                        [[30,0], [0,40], [0,0]],
                        [[-30,0], [0,0], [0,40]],
                        [[0,0], [20,-20], [20,20]],
                        [[0,0], [-20,-20], [-20,20]],
                        [[0,0], [20,20], [-20,20]],
                        [[0,0], [-20,-20], [20,-20]]
                    ];
                    
                    faces.forEach((face, i) => {
                        group.append('polygon')
                            .attr('points', face.map(p => `${p[0]},${p[1]}`).join(' '))
                            .attr('fill', `url(#gradient-${config.id})`)
                            .attr('stroke', config.color)
                            .attr('stroke-width', 0.5)
                            .attr('opacity', 0.5 + (i % 2) * 0.2);
                    });
                    break;
                    
                case 'cube':
                    // 정육면체 (6개 면)
                    const size = 25;
                    const cubePoints = [
                        [[-size,-size], [size,-size], [size,size], [-size,size]], // 앞면
                        [[-size+10,-size-10], [size+10,-size-10], [size+10,size-10], [-size+10,size-10]], // 뒷면
                        [[-size,-size], [-size+10,-size-10], [size+10,-size-10], [size,-size]], // 윗면
                        [[-size,size], [-size+10,size-10], [size+10,size-10], [size,size]], // 아랫면
                        [[-size,-size], [-size,size], [-size+10,size-10], [-size+10,-size-10]], // 왼쪽면
                        [[size,-size], [size,size], [size+10,size-10], [size+10,-size-10]] // 오른쪽면
                    ];
                    
                    cubePoints.forEach((face, i) => {
                        group.append('polygon')
                            .attr('points', face.map(p => `${p[0]},${p[1]}`).join(' '))
                            .attr('fill', `url(#gradient-${config.id})`)
                            .attr('stroke', config.color)
                            .attr('stroke-width', 0.5)
                            .attr('opacity', 0.4 + (i % 3) * 0.2);
                    });
                    break;
                    
                case 'tetrahedron':
                    // 정사면체 (4개 면)
                    const tetraSize = 35;
                    const tetraFaces = [
                        [[0,-tetraSize], [tetraSize*0.8,tetraSize*0.5], [-tetraSize*0.8,tetraSize*0.5]],
                        [[0,-tetraSize], [tetraSize*0.8,tetraSize*0.5], [0,0]],
                        [[0,-tetraSize], [-tetraSize*0.8,tetraSize*0.5], [0,0]],
                        [[tetraSize*0.8,tetraSize*0.5], [-tetraSize*0.8,tetraSize*0.5], [0,0]]
                    ];
                    
                    tetraFaces.forEach((face, i) => {
                        group.append('polygon')
                            .attr('points', face.map(p => `${p[0]},${p[1]}`).join(' '))
                            .attr('fill', `url(#gradient-${config.id})`)
                            .attr('stroke', config.color)
                            .attr('stroke-width', 0.5)
                            .attr('opacity', 0.6 + (i % 2) * 0.3);
                    });
                    break;
            }
            
            return group;
        }

        const polyhedron = createPolyhedron(config.type);

        // 간단한 애니메이션
        function animate() {
            rotation += config.rotation;
            const scale = 0.9 + Math.sin(Date.now() * 0.002) * 0.1;
            
            polyhedron.attr('transform', 
                `translate(${centerX}, ${centerY}) 
                 rotate(${rotation * 57.3}) 
                 scale(${scale})`);
            
            requestAnimationFrame(animate);
        }

        // 시작 지연
        setTimeout(() => {
            animate();
        }, index * 200);
    });
}

// =============================================================================
// ENHANCED INTERSECTION OBSERVER FOR ANIMATIONS
// =============================================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// =============================================================================
// INITIALIZATION FUNCTIONS
// =============================================================================
function initializeD3Backgrounds() {
    // Initialize Hero background when home section is loaded
    if (document.querySelector('.hero') && !heroBackground) {
        heroBackground = createD3Background('#d3-background', '.hero', 23, 4);
    }
    
    // Initialize Philosophy background when concept section is loaded
    if (document.querySelector('.philosophy') && !philosophyBackground) {
        philosophyBackground = createD3Background('#d3-philosophy-background', '.philosophy', 18, 3);
    }
}

function initializeBaryonParticles() {
    // Initialize Baryon Particles when team section is loaded
    if (document.querySelector('.team-section')) {
        initBaryonParticles();
    }
}

function initializeConceptCards() {
    // Initialize concept card animations when concept section is loaded
    const cards = document.querySelectorAll('.concept-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
}

// =============================================================================
// CONTACT FORM HANDLING
// =============================================================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return; // Exit if contact form is not loaded yet

    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const toggleBtn = document.getElementById('toggleOptional');
    const optionalFields = document.getElementById('optionalFields');

    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateWorkEmail(email) {
        // 기본 이메일 형식 체크
        if (!validateEmail(email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }

        // 개인 이메일 서비스 제공업체 도메인 목록
        const personalEmailDomains = [
            'gmail.com', 'naver.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
            'daum.net', 'hanmail.net', 'live.com', 'msn.com', 'yahoo.co.kr',
            'icloud.com', 'me.com', 'mac.com', 'qq.com', '163.com', '126.com',
            'sina.com', 'sohu.com', 'yeah.net', 'yandex.com', 'mail.ru',
            'protonmail.com', 'tutanota.com', 'guerrillamail.com', 'temp-mail.org',
            'mailinator.com', '10minutemail.com', 'aol.com', 'zoho.com'
        ];

        // 도메인 추출
        const domain = email.split('@')[1]?.toLowerCase();
        
        if (personalEmailDomains.includes(domain)) {
            return { valid: false, message: 'Please use your work email address, not personal email services' };
        }

        return { valid: true };
    }

    function validatePhone(phone) {
        if (!phone) return true; // Phone is optional
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\(\)\-\.]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId === 'inquiry-type' ? 'inquiry-type' : fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        if (inputElement) {
            inputElement.style.borderColor = '#EF4444';
        }
    }

    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId === 'inquiry-type' ? 'inquiry-type' : fieldId);
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        if (inputElement) {
            inputElement.style.borderColor = 'rgba(59, 130, 246, 0.2)';
        }
    }

    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        const inputElements = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        errorElements.forEach(el => el.classList.remove('show'));
        inputElements.forEach(el => el.style.borderColor = 'rgba(59, 130, 246, 0.2)');
    }

    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message show ${type}`;
            
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 5000);
        }
    }

    function setLoadingState(loading) {
        if (submitBtn) {
            if (loading) {
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
            } else {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        }
    }

    // Check if all required fields are filled
    function checkRequiredFields() {
        const requiredFields = document.querySelectorAll('.required-field');
        let allFilled = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                allFilled = false;
            }
        });
        
        if (toggleBtn && optionalFields) {
            if (allFilled) {
                toggleBtn.classList.add('hidden');
                optionalFields.classList.add('expanded');
            } else {
                toggleBtn.classList.remove('hidden');
            }
        }
    }

    // Toggle optional fields manually
    function toggleOptionalFields() {
        if (optionalFields && toggleBtn) {
            if (optionalFields.classList.contains('expanded')) {
                optionalFields.classList.remove('expanded');
                toggleBtn.textContent = '+ Add Optional Details';
            } else {
                optionalFields.classList.add('expanded');
                toggleBtn.textContent = '- Hide Optional Details';
            }
        }
    }

    // Real-time validation (with null checks)
    const workEmailField = document.getElementById('work_email');
    if (workEmailField) {
        workEmailField.addEventListener('blur', function() {
            if (this.value) {
                const validation = validateWorkEmail(this.value);
                if (!validation.valid) {
                    showError('work_email', validation.message);
                } else {
                    clearError('work_email');
                }
            } else {
                clearError('work_email');
            }
        });
    }

    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                showError('phone', 'Please enter a valid phone number');
            } else {
                clearError('phone');
            }
        });
    }

    // Clear errors on input and check required fields (with null checks)
    const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearError(this.id === 'inquiry-type' ? 'inquiry-type' : this.id);
            checkRequiredFields();
        });
    });

    // Toggle button event listener (with null check)
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleOptionalFields);
    }

    // Form submission (with null check)
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            clearAllErrors();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name').trim(),
                work_email: formData.get('work_email').trim(),
                phone: formData.get('phone') ? formData.get('phone').trim() : '',
                company: formData.get('company') ? formData.get('company').trim() : '',
                inquiry_type: formData.get('inquiry_type'),
                subject: formData.get('subject'),
                message: formData.get('message').trim()
            };

            // Validation
            let hasErrors = false;

            if (!data.name) {
                showError('name', 'Name is required');
                hasErrors = true;
            }

            if (!data.work_email) {
                showError('work_email', 'Work email is required');
                hasErrors = true;
            } else {
                const validation = validateWorkEmail(data.work_email);
                if (!validation.valid) {
                    showError('work_email', validation.message);
                    hasErrors = true;
                }
            }

            if (data.phone && !validatePhone(data.phone)) {
                showError('phone', 'Please enter a valid phone number');
                hasErrors = true;
            }

            if (!data.inquiry_type) {
                showError('inquiry-type', 'Please select an inquiry type');
                hasErrors = true;
            }

            if (!data.subject) {
                showError('subject', 'Subject is required');
                hasErrors = true;
            }

            if (!data.message) {
                showError('message', 'Message is required');
                hasErrors = true;
            }

            if (hasErrors) {
                showFormMessage('Please fix the errors above', 'error');
                return;
            }

            // Set loading state
            setLoadingState(true);

            try {
                // Submit to Form2AI2Email service
                const response = await fetch('https://form2ai2email-worker.kilos-network.workers.dev/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        form_id: '99f754ea-af00-4048-9fcc-18bae53fed3f', // Fixed UUID for Baryon Labs contact form
                        data: data
                    })
                });

                if (response.ok) {
                    showFormMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    clearAllErrors();
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('Failed to send message. Please try again later.', 'error');
            } finally {
                setLoadingState(false);
            }
        });
    }
}

// =============================================================================
// CAREERS SECTION FUNCTIONALITY
// =============================================================================
function openJobModal(jobId) {
    const modal = document.getElementById('job-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeJobModal() {
    const modal = document.getElementById('job-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

// Listen for HTMX events to initialize components when sections load
document.addEventListener('htmx:afterSettle', function(event) {
    initializeD3Backgrounds();
    initializeBaryonParticles();
    initializeConceptCards();
    initializeContactForm();
});

// Initial setup for home section (loads immediately)
document.addEventListener('DOMContentLoaded', () => {
    initializeD3Backgrounds();
    initializeLanguageSystem();
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('job-modal');
    if (event.target === modal) {
        closeJobModal();
    }
});

// =============================================================================
// GLOBAL FUNCTION EXPORTS
// =============================================================================
window.openJobModal = openJobModal;
window.closeJobModal = closeJobModal; 