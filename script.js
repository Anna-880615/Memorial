// 1. 语言管理系统
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'zh';
        this.translations = {
            zh: {
                'nav.about': '关于', 'nav.works': '影视', 'nav.mv': 'MV', 'nav.music': '音乐',
                'nav.flowers': '送花', 'nav.messages': '留言', 'nav.notice': '说明',
                'message.title': '纪念留言', 'message.subtitle': '在这里分享您对他最深切的思念。',
                'message.placeholder': '在这里分享您的思念...', 'message.submit': '发布',
                'message.empty': '请输入留言内容', 'message.submitted': '留言已提交。',
                'intro.name': '于朦胧', 'intro.dates': '(1988年6月15日 - 2025年9月11日)',
                'intro.bio': '出生于新疆乌鲁木齐市，中国内地男演员、歌手、MV导演。',
                'intro.quote': '你是一个拥有纯净，善良，正直之心的人，你值得被更多的人喜欢',
                'works.title': '影视作品', 'works.role': '饰演',
                'media.title': 'MV作品', 'media.noVideo': '您的浏览器不支持视频播放', 'media.playlist': 'MV列表',
                'music.title': '音乐作品', 'music.noSong': '未选择歌曲', 'music.playlist': '歌曲列表', 'music.volume': '音量',
                'music.play': '播放', 'music.pause': '暂停', 'music.prev': '上一首', 'music.next': '下一首',
                'flower.title': '送花', 'flower.btn6': '送 6 朵花', 'flower.btn15': '送 15 朵花',
                'flower.limit': '今天最多只能送', 'flower.remaining': '朵花', 'flower.unit': '朵',
                'flower.counter': '今日已送：', 'flower.total': '送花总数：',
                'flower.limit.reached': '今天最多只能送 {max} 朵花，您还可以送 {remaining} 朵',
                'flower.error.failed': '送花失败，请稍后重试',
                'flower.error.invalid': '送花数量无效',
                'notice.title': '网站说明',
                'notice.section1.title': '1. 网站目的', 'notice.section1.content': '该网站的目的是为了纪念朦胧，非赢利性网站。',
                'notice.section2.title': '2. 留言规范', 'notice.section2.content': '请各位用户妥善留言，不要发布敏感词汇或者是任何涉及言语攻击、暴力等内容。',
                'notice.section3.title': '3. 资源来源', 'notice.section3.content': '图片、音乐和视频都是我从网络上下载的，不会另作他用，只是为了留作纪念。',
                'notice.section4.title': '4. 版权声明', 'notice.section4.content': '部分MV作品是从YouTube下载的，原创者如果觉得不妥，可以联系我，我会及时删除。',
                'notice.section5.title': '5. 征集投稿', 'notice.section5.content': '我手里的资源十分有限，在这里诚心征集更多网友们的投稿，图片、视频等不限，我希望能够合力将这个网站做得更好。',
                'notice.section6.title': '6. 联系方式', 'notice.section6.content': '以下是我的联系方式，如果有投稿请发送到我的邮箱，谢谢大家！',
                'notice.email.label': '邮箱：'
            },
            en: {
                'nav.about': 'About', 'nav.works': 'Works', 'nav.mv': 'MV', 'nav.music': 'Music',
                'nav.flowers': 'Flowers', 'nav.messages': 'Messages', 'nav.notice': 'Notice',
                'message.title': 'Memorial Messages', 'message.subtitle': 'Share your memories and thoughts here.',
                'message.placeholder': 'Share your thoughts here...', 'message.submit': 'Post',
                'message.empty': 'Please enter a message', 'message.submitted': 'Message submitted.',
                'intro.name': 'Alan Yu', 'intro.dates': '(June 15, 1988 – September 11, 2025)',
                'intro.bio': 'Mainland Chinese actor, singer, and MV director, born in Xinjiang.',
                'intro.quote': 'A pure heart, a gentle spirit, and a steadfast sense of right — these were always you.',
                'works.title': 'Film & TV', 'works.role': 'Role',
                'media.title': 'MV Works', 'media.noVideo': 'Browser does not support video', 'media.playlist': 'Playlist',
                'music.title': 'Musical Works', 'music.noSong': 'No song selected', 'music.playlist': 'Playlist', 'music.volume': 'Volume',
                'music.play': 'Play', 'music.pause': 'Pause', 'music.prev': 'Previous', 'music.next': 'Next',
                'flower.title': 'Send Flowers', 'flower.btn6': 'Send 6 Flowers', 'flower.btn15': 'Send 15 Flowers',
                'flower.limit': 'You can only send', 'flower.remaining': ' more flowers', 'flower.unit': ' flowers',
                'flower.counter': 'Today sent: ', 'flower.total': 'Total sent: ',
                'flower.limit.reached': 'You can only send {max} flowers today. You can still send {remaining} more',
                'flower.error.failed': 'Failed to send flowers. Please try again later',
                'flower.error.invalid': 'Invalid flower count',
                'notice.title': 'Website Notice',
                'notice.section1.title': '1. Website Purpose', 'notice.section1.content': 'This website is created to commemorate Alan Yu. It is a non-profit website.',
                'notice.section2.title': '2. Message Guidelines', 'notice.section2.content': 'Please be respectful. No sensitive or offensive content.',
                'notice.section3.title': '3. Resource Sources', 'notice.section3.content': 'All media is downloaded from the internet for memorial purposes only.',
                'notice.section4.title': '4. Copyright Notice', 'notice.section4.content': 'Some content is from YouTube. Contact me for removal if inappropriate.',
                'notice.section5.title': '5. Content Submission', 'notice.section5.content': 'I welcome submissions from fans to make this website better.',
                'notice.section6.title': '6. Contact Information', 'notice.section6.content': 'Please send submissions to my email below.',
                'notice.email.label': 'Email: '
            }
        };
        this.init();
    }
    
    init() {
        const langZh = document.getElementById('langZh');
        const langEn = document.getElementById('langEn');
        if(langZh) langZh.addEventListener('click', () => this.setLanguage('zh'));
        if(langEn) langEn.addEventListener('click', () => this.setLanguage('en'));
        this.applyLanguage();
    }
    
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.applyLanguage();
        document.getElementById('langZh').classList.toggle('active', lang === 'zh');
        document.getElementById('langEn').classList.toggle('active', lang === 'en');
    }
    
    applyLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translations[this.currentLang][key];
            if (translation) element.textContent = translation;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.translations[this.currentLang][key];
            if (translation) element.placeholder = translation;
        });
        document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
    }
    
    t(key) { return this.translations[this.currentLang][key] || key; }
    getCurrentLang() { return this.currentLang; }
}

let languageManager;

// 导航栏管理器
class NavbarAutoHide {
    constructor() {
        this.navbar = document.querySelector('.top-nav');
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }
    init() {
        // 桌面端：鼠标移动到顶部显示
        document.addEventListener('mousemove', (e) => {
            if (this.isMobile) return;
            if (e.clientY <= 80 || (this.navbar && this.navbar.contains(e.target))) {
                this.navbar.classList.add('visible');
            } else {
                this.navbar.classList.remove('visible');
            }
        });
        
        // 移动端：触摸顶部区域或点击时显示
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            // 触摸顶部80px区域时显示导航栏
            if (touchStartY <= 80) {
                this.navbar.classList.add('visible');
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            const touchCurrentY = e.touches[0].clientY;
            // 向下滑动时隐藏导航栏（除非在导航栏内）
            if (touchCurrentY > touchStartY + 50 && !this.navbar.contains(e.target)) {
                this.navbar.classList.remove('visible');
            }
            // 向上滑动到顶部时显示导航栏
            if (touchCurrentY <= 80) {
                this.navbar.classList.add('visible');
            }
        }, { passive: true });
        
        // 滚动到顶部时始终显示导航栏
        window.addEventListener('scroll', () => {
            if (window.scrollY <= 50) {
                this.navbar.classList.add('visible');
            }
        }, { passive: true });
        
        // 窗口大小改变时更新移动端状态
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
        });
    }
}

// 模态框管理器（这里修复了 MV 按钮的绑定问题）
class ModalManager {
    constructor() {
        this.init();
        this.initMobileMenu();
    }
    
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navRight = document.getElementById('navRight');
        const navMenu = document.getElementById('navMenu');
        
        if (!mobileMenuBtn || !navRight) return;
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        overlay.id = 'mobileOverlay';
        document.body.appendChild(overlay);
        
        // 汉堡菜单点击
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navRight.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
            document.body.style.overflow = navRight.classList.contains('mobile-open') ? 'hidden' : '';
        });
        
        // 遮罩层点击关闭
        overlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });
        
        // 菜单项点击后关闭菜单
        if (navMenu) {
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-item')) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    closeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navRight = document.getElementById('navRight');
        const overlay = document.getElementById('mobileOverlay');
        
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        if (navRight) navRight.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    init() {
        // 手动绑定 ID，确保 navMV (大写) 能被正确识别
        const bindings = [
            { btn: 'navAbout', modal: 'aboutModal', close: 'closeAbout' },
            { btn: 'navWorks', modal: 'worksModal', close: 'closeWorks' },
            { btn: 'navMV',    modal: 'mvModal',    close: 'closeMV' },   // 关键修复
            { btn: 'navMusic', modal: 'musicModal', close: 'closeMusic' },
            { btn: 'navFlowers', modal: 'flowersModal', close: 'closeFlowers' },
            { btn: 'navNotice', modal: 'noticeModal', close: 'closeNotice' }
        ];

        bindings.forEach(bind => {
            const btnEl = document.getElementById(bind.btn);
            const modalEl = document.getElementById(bind.modal);
            const closeEl = document.getElementById(bind.close);

            if (btnEl && modalEl) {
                btnEl.addEventListener('click', () => this.openModal(modalEl));
            }
            if (closeEl && modalEl) {
                closeEl.addEventListener('click', () => this.closeModal(modalEl));
            }
            if (modalEl) {
                modalEl.addEventListener('click', (e) => {
                    if (e.target === modalEl) this.closeModal(modalEl);
                });
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') document.querySelectorAll('.modal.active').forEach(m => this.closeModal(m));
        });
    }

    openModal(modal) {
        this.closeMobileMenu(); // 打开模态框时关闭移动菜单
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
        document.body.style.overflow = '';
    }
}

// 图片轮播
class ImageCarousel {
    constructor() {
        this.wrapper = document.getElementById('carouselWrapper');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.getElementById('indicators');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentIndex = 1;
        this.slideCount = this.slides.length;
        this.isTransitioning = false;
        // 触摸滑动相关
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchCurrentX = 0;
        this.isDragging = false;
        this.threshold = 50; // 滑动阈值
        this.init();
    }
    init() {
        if(!this.wrapper) return;
        this.cloneSlides();
        this.setupIndicators();
        this.updatePosition(false);
        this.prevBtn.addEventListener('click', () => this.move(-1));
        this.nextBtn.addEventListener('click', () => this.move(1));
        this.wrapper.addEventListener('transitionend', () => this.checkReset());
        // 触摸事件
        this.setupTouchEvents();
        // 自动播放
        this.autoPlayTimer = setInterval(() => { if(!this.isTransitioning && !this.isDragging) this.move(1); }, 5000);
    }
    
    setupTouchEvents() {
        let touchDirection = null; // 'horizontal' 或 'vertical'，null 表示未确定
        
        this.wrapper.addEventListener('touchstart', (e) => {
            if (this.isTransitioning) return;
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.touchCurrentX = this.touchStartX;
            this.isDragging = true;
            touchDirection = null; // 重置方向
            this.wrapper.style.transition = 'none';
        }, { passive: true });
        
        this.wrapper.addEventListener('touchmove', (e) => {
            if (!this.isDragging || this.isTransitioning) return;
            
            this.touchCurrentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = this.touchCurrentX - this.touchStartX;
            const deltaY = currentY - this.touchStartY;
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            
            // 如果方向还未确定，先判断滑动方向
            if (touchDirection === null) {
                // 需要移动超过一定距离才能确定方向（避免误判）
                const minDistance = 15;
                if (absDeltaX > minDistance || absDeltaY > minDistance) {
                    // 水平滑动明显大于垂直滑动（至少是2倍），才认为是水平滑动
                    if (absDeltaX > absDeltaY * 2) {
                        touchDirection = 'horizontal';
                    } else if (absDeltaY > absDeltaX * 2) {
                        touchDirection = 'vertical';
                        // 如果是垂直滑动，立即停止处理，让页面正常滚动
                        this.isDragging = false;
                        this.updatePosition(true);
                        return;
                    }
                }
            }
            
            // 只有在明确是水平滑动时才阻止默认行为并处理轮播
            if (touchDirection === 'horizontal' && absDeltaX > 10) {
                e.preventDefault();
                const currentOffset = -this.currentIndex * 100;
                const movePercent = (deltaX / window.innerWidth) * 100;
                this.wrapper.style.transform = `translateX(${currentOffset + movePercent}%)`;
            }
        }, { passive: false });
        
        this.wrapper.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            const wasHorizontal = touchDirection === 'horizontal';
            this.isDragging = false;
            
            // 只有在水平滑动时才处理切换
            if (wasHorizontal) {
                const deltaX = this.touchCurrentX - this.touchStartX;
                
                if (Math.abs(deltaX) > this.threshold) {
                    if (deltaX > 0) {
                        this.move(-1); // 向右滑动，上一张
                    } else {
                        this.move(1);  // 向左滑动，下一张
                    }
                } else {
                    // 没有超过阈值，恢复原位
                    this.updatePosition(true);
                }
            } else {
                // 垂直滑动或未确定方向，恢复原位
                this.updatePosition(true);
            }
            
            touchDirection = null; // 重置方向
        }, { passive: true });
        
        this.wrapper.addEventListener('touchcancel', () => {
            this.isDragging = false;
            touchDirection = null;
            this.updatePosition(true);
        }, { passive: true });
    }
    cloneSlides() {
        const first = this.slides[0].cloneNode(true);
        const last = this.slides[this.slideCount - 1].cloneNode(true);
        this.wrapper.appendChild(first);
        this.wrapper.insertBefore(last, this.wrapper.firstChild);
        this.realSlides = document.querySelectorAll('.carousel-slide');
    }
    setupIndicators() {
        for(let i=0; i<this.slideCount; i++) {
            const dot = document.createElement('div');
            dot.className = i===0 ? 'indicator active' : 'indicator';
            dot.onclick = () => {
                if(this.isTransitioning) return;
                this.currentIndex = i + 1;
                this.updatePosition(true);
            };
            this.indicators.appendChild(dot);
        }
    }
    move(dir) {
        if(this.isTransitioning) return;
        this.currentIndex += dir;
        this.updatePosition(true);
    }
    updatePosition(animate) {
        this.isTransitioning = animate;
        this.wrapper.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
        this.wrapper.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateIndicators();
    }
    updateIndicators() {
        let realIdx = this.currentIndex - 1;
        if(realIdx < 0) realIdx = this.slideCount - 1;
        if(realIdx >= this.slideCount) realIdx = 0;
        Array.from(this.indicators.children).forEach((dot, i) => {
            dot.classList.toggle('active', i === realIdx);
        });
    }
    checkReset() {
        this.isTransitioning = false;
        if(this.currentIndex === 0) {
            this.currentIndex = this.slideCount;
            this.updatePosition(false);
        } else if(this.currentIndex === this.realSlides.length - 1) {
            this.currentIndex = 1;
            this.updatePosition(false);
        }
    }
}

// 留言板（使用API版本）
class MessageBoard {
    constructor() {
        this.wrapper = document.getElementById('messagesWrapper');
        this.input = document.getElementById('messageInput');
        this.btn = document.getElementById('submitMessage');
        this.messages = [];
        this.init();
    }
    
    async init() {
        if(!this.wrapper) return;
        await this.loadMessages();
        this.render();
        this.btn.addEventListener('click', () => this.submit());
        window.addEventListener('languageChanged', () => this.updateUI());
        
        // 监听输入框变化，实时更新字符数
        if (this.input) {
            this.input.addEventListener('input', () => this.updateCharCount());
            this.updateCharCount(); // 初始化字符数显示
        }
        
        // 监听滚动事件
        if (this.wrapper) {
            this.wrapper.addEventListener('scroll', () => {
                this.updateFadeOnScroll();
            });
        }
        
        // 监听窗口大小改变
        window.addEventListener('resize', () => {
            this.updateFadeVisibility();
        });
    }
    
    updateCharCount() {
        const charCountEl = document.getElementById('messageCharCount');
        if (!charCountEl || !this.input) return;
        
        // 按实际字符数计算（中英文都算1个字符）
        const text = this.input.value;
        const charCount = Array.from(text).length;
        const maxChars = 1000;
        
        charCountEl.textContent = `${charCount} / ${maxChars}`;
        
        // 超过限制时显示警告样式
        if (charCount > maxChars) {
            charCountEl.classList.add('char-count-overflow');
        } else {
            charCountEl.classList.remove('char-count-overflow');
        }
    }
    
    async loadMessages() {
        try {
            const apiEndpoint = typeof CONFIG !== 'undefined' ? CONFIG.API_ENDPOINT : '/api';
            const response = await fetch(`${apiEndpoint}/messages`);
            const data = await response.json();
            if (data.success) {
                this.messages = data.messages || [];
            }
        } catch (error) {
            console.error('加载留言失败:', error);
            this.messages = [];
        }
    }
    
    async submit() {
        const text = this.input.value.trim();
        if(!text) { 
            alert(languageManager ? languageManager.t('message.empty') : '请输入留言内容'); 
            return; 
        }
        
        // 检查字符数限制（按实际字符数计算）
        const charCount = Array.from(text).length;
        if (charCount > 1000) {
            alert(`留言内容过长（最多1000字，当前${charCount}字）`);
            return;
        }
        
        // 禁用按钮防止重复提交
        this.btn.disabled = true;
        const originalText = this.btn.textContent;
        this.btn.textContent = '提交中...';
        
        try {
            const apiEndpoint = typeof CONFIG !== 'undefined' ? CONFIG.API_ENDPOINT : '/api';
            const response = await fetch(`${apiEndpoint}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    timestamp: Date.now()
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // 提交成功，但需要审核，所以不立即显示
                this.input.value = '';
                alert(languageManager ? languageManager.t('message.submitted') : '留言已提交，等待审核通过后将显示。');
                // 重新加载留言列表（可能会有延迟）
                setTimeout(() => this.loadMessages(), 1000);
            } else {
                throw new Error(result.error || '提交失败');
            }
        } catch (error) {
            console.error('提交留言失败:', error);
            alert('提交失败，请稍后重试');
        } finally {
            this.btn.disabled = false;
            this.btn.textContent = originalText;
        }
    }
    
    formatDateTime(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
    
    render() {
        if (!this.wrapper) return;
        
        // 按时间排序，最新的在前面，只显示已审核的
        const sortedMessages = [...this.messages]
            .filter(msg => msg.status === 'approved')
            .sort((a, b) => b.timestamp - a.timestamp);
        
        this.wrapper.innerHTML = sortedMessages.map(m => `
            <div class="message-item">
                <p class="message-text">${this.escapeHtml(m.text)}</p>
                <span class="message-time">${this.formatDateTime(m.timestamp)}</span>
            </div>
        `).join('');
        
        this.updateFadeVisibility();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    updateFadeOnScroll() {
        const fadeElement = document.querySelector('.messages-fade');
        if (!this.wrapper || !fadeElement) return;
        
        const scrollTop = this.wrapper.scrollTop;
        const scrollHeight = this.wrapper.scrollHeight;
        const clientHeight = this.wrapper.clientHeight;
        
        if (scrollHeight <= clientHeight) {
            fadeElement.style.display = 'none';
            return;
        }
        
        fadeElement.style.display = 'block';
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        fadeElement.style.opacity = isAtBottom ? '0' : '1';
    }
    
    updateFadeVisibility() {
        const fadeElement = document.querySelector('.messages-fade');
        if (!this.wrapper || !fadeElement) return;
        
        setTimeout(() => {
            const isScrollable = this.wrapper.scrollHeight > this.wrapper.clientHeight;
            if (isScrollable) {
                fadeElement.style.display = 'block';
                const scrollTop = this.wrapper.scrollTop;
                const scrollHeight = this.wrapper.scrollHeight;
                const clientHeight = this.wrapper.clientHeight;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
                fadeElement.style.opacity = isAtBottom ? '0' : '1';
            } else {
                fadeElement.style.display = 'none';
            }
        }, 100);
    }
    
    async getAllMessages() {
        // 管理员需要获取所有留言（包括pending）
        // 这个方法现在由AdminManager直接调用API，保留以兼容旧代码
        return [];
    }
    
    updateUI() {
        if (languageManager) {
            this.btn.textContent = languageManager.t('message.submit');
            this.input.placeholder = languageManager.t('message.placeholder');
        }
    }
}

// 送花功能（使用API版本）
class FlowerSection {
    constructor() {
        this.count = 0;
        this.max = 21;
        this.total = 0;
        this.init();
    }
    
    async init() {
        await this.loadToday();
        await this.loadTotal();
        document.getElementById('flowerBtn6').onclick = () => this.send(6);
        document.getElementById('flowerBtn15').onclick = () => this.send(15);
        this.updateDisplay();
        
        // 记录上次检查的日期，用于检测日期变化
        this.lastCheckedDate = this.getLocalDateString();
        
        // 监听语言变化
        window.addEventListener('languageChanged', () => {
            this.updateUI();
        });
        
        // 监听送花模态框打开事件，打开时重新加载数据
        const flowersModal = document.getElementById('flowersModal');
        if (flowersModal) {
            // 使用 MutationObserver 监听模态框的 class 变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (flowersModal.classList.contains('active')) {
                            // 模态框已打开，检查并重新加载数据
                            this.checkAndReloadIfNewDay();
                        }
                    }
                });
            });
            observer.observe(flowersModal, { attributes: true });
        }
        
        // 监听页面可见性变化，当页面重新可见时检查日期
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkAndReloadIfNewDay();
            }
        });
        
        // 监听窗口焦点变化
        window.addEventListener('focus', () => {
            this.checkAndReloadIfNewDay();
        });
        
        // 每分钟检查一次日期是否变化（防止页面长时间打开）
        setInterval(() => {
            this.checkAndReloadIfNewDay();
        }, 60000); // 60秒检查一次
    }
    
    // 检查日期是否变化，如果变化则重新加载数据
    async checkAndReloadIfNewDay() {
        const currentDate = this.getLocalDateString();
        if (currentDate !== this.lastCheckedDate) {
            // 日期已变化，重新加载今日数据
            this.lastCheckedDate = currentDate;
            await this.loadToday();
            this.updateDisplay();
        }
    }
    
    // 获取本地时区的日期字符串（YYYY-MM-DD格式）
    getLocalDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    async loadToday() {
        try {
            const apiEndpoint = typeof CONFIG !== 'undefined' ? CONFIG.API_ENDPOINT : '/api';
            // 传递本地时区的日期给后端
            const localDate = this.getLocalDateString();
            const response = await fetch(`${apiEndpoint}/flowers/today?date=${localDate}`);
            const data = await response.json();
            if (data.success) {
                this.count = data.count || 0;
            }
        } catch (error) {
            console.error('加载今日送花数失败:', error);
            this.count = 0;
        }
    }
    
    async loadTotal() {
        try {
            const apiEndpoint = typeof CONFIG !== 'undefined' ? CONFIG.API_ENDPOINT : '/api';
            const response = await fetch(`${apiEndpoint}/flowers/total`);
            const data = await response.json();
            if (data.success) {
                this.total = data.total || 0;
            }
        } catch (error) {
            console.error('加载总数失败:', error);
            this.total = 0;
        }
    }
    
    async send(num) {
        if(this.count + num > this.max) {
            const remaining = this.max - this.count;
            let msg;
            if (languageManager) {
                msg = languageManager.t('flower.limit.reached')
                    .replace('{max}', this.max)
                    .replace('{remaining}', remaining);
            } else {
                msg = `今天最多只能送${this.max}朵花，您还可以送${remaining}朵。`;
            }
            alert(msg);
            return;
        }
        
        // 禁用按钮防止重复提交
        const btn6 = document.getElementById('flowerBtn6');
        const btn15 = document.getElementById('flowerBtn15');
        btn6.disabled = true;
        btn15.disabled = true;
        
        try {
            const apiEndpoint = typeof CONFIG !== 'undefined' ? CONFIG.API_ENDPOINT : '/api';
            const response = await fetch(`${apiEndpoint}/flowers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    count: num,
                    date: this.getLocalDateString() // 使用本地时区的日期
                })
            });
            
            const result = await response.json();
            
            // 检查 HTTP 状态码和响应结果
            if (!response.ok || !result.success) {
                // 处理错误情况
                let errorMsg;
                if (result.message) {
                    // API 返回了错误消息
                    if (languageManager) {
                        if (result.message.includes('最多只能送')) {
                            // API 返回了限制错误，使用限制提示
                            const match = result.message.match(/(\d+)/g);
                            if (match && match.length >= 2) {
                                const max = match[0];
                                const remaining = match[1];
                                errorMsg = languageManager.t('flower.limit.reached')
                                    .replace('{max}', max)
                                    .replace('{remaining}', remaining);
                            } else {
                                errorMsg = languageManager.t('flower.error.failed');
                            }
                        } else {
                            errorMsg = result.message; // 直接显示服务器返回的消息
                        }
                    } else {
                        errorMsg = result.message;
                    }
                } else {
                    errorMsg = languageManager 
                        ? languageManager.t('flower.error.failed')
                        : '送花失败，请稍后重试';
                }
                alert(errorMsg);
                return;
            }
            
            // 成功情况
            this.count = result.todayCount;
            this.total = result.total;
            this.createHearts(num);
            this.updateDisplay();
        } catch (error) {
            console.error('送花失败:', error);
            // 使用语言系统的错误提示
            const errorMsg = languageManager 
                ? languageManager.t('flower.error.failed')
                : '送花失败，请稍后重试';
            alert(errorMsg);
        } finally {
            btn6.disabled = false;
            btn15.disabled = false;
        }
    }
    formatNumber(num) {
        // 格式化大数字，添加千位分隔符
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString('zh-CN');
    }
    
    updateDisplay() {
        const c = document.getElementById('flowerCount');
        const t = document.getElementById('flowerTotal');
        if(c) c.textContent = this.count;
        if(t) t.textContent = this.formatNumber(this.total);
        
        // 更新按钮状态
        const remaining = this.max - this.count;
        document.getElementById('flowerBtn6').disabled = remaining < 6;
        document.getElementById('flowerBtn15').disabled = remaining < 15;
        
        // 更新显示文本（支持多语言）
        if (languageManager) {
            const counterText = languageManager.t('flower.counter');
            const unit = languageManager.t('flower.unit');
            const counterEl = document.getElementById('flowerCounterText');
            if (counterEl) {
                counterEl.innerHTML = `${counterText}<span id="flowerCount">${this.count}</span> / ${this.max} ${unit}`;
            }
            
            const totalText = languageManager.t('flower.total');
            const totalEl = document.getElementById('flowerTotalText');
            if (totalEl) {
                totalEl.innerHTML = `${totalText}<span id="flowerTotal">${this.formatNumber(this.total)}</span> ${unit}`;
            }
        } else {
            // 如果没有语言管理器，使用默认中文
            const counterEl = document.getElementById('flowerCounterText');
            if (counterEl) {
                counterEl.innerHTML = `今日已送：<span id="flowerCount">${this.count}</span> / ${this.max} 朵`;
            }
            
            const totalEl = document.getElementById('flowerTotalText');
            if (totalEl) {
                totalEl.innerHTML = `送花总数：<span id="flowerTotal">${this.formatNumber(this.total)}</span> 朵`;
            }
        }
    }
    
    createHearts(num) {
        const bg = document.getElementById('flowerBackground');
        for(let i=0; i<num; i++) {
            setTimeout(() => {
                const h = document.createElement('div');
                h.className = 'heart';
                h.textContent = '❤️';
                h.style.left = Math.random() * 90 + '%';
                h.style.top = '80%';
                bg.appendChild(h);
                setTimeout(() => h.remove(), 2000);
            }, i * 150);
        }
    }
    
    updateUI() {
        if (languageManager) {
            document.getElementById('flowerBtn6').textContent = languageManager.t('flower.btn6');
            document.getElementById('flowerBtn15').textContent = languageManager.t('flower.btn15');
            this.updateDisplay();
        }
    }
}

// MV 播放器
class MediaPlayer {
    constructor() {
        this.video = document.getElementById('videoPlayer');
        this.list = document.getElementById('mvList');
        this.title = document.getElementById('mvCurrentTitle');
        // MV 数据完整保留
        this.mvs = [
            { name: '星火', src: 'videos/xinghuo.mp4' },
            { name: '梦未完待续', src: 'videos/mengweiwandaixu.mp4' },
            { name: '你早就知道', src: 'videos/nizaojiuzhidao.mp4' },
            { name: '镜', src: 'videos/jing.mp4' },
            { name: '月朦胧鸟朦胧', src: 'videos/yuemenglongniaomenglong.mp4' },
            { name: '月光', src: 'videos/yueguang.mp4' },
            { name: '自导自演', src: 'videos/zidaoziyan.mp4' },
            { name: '入戏', src: 'videos/ruxi.mp4' },
            { name: '一个人过', src: 'videos/yigerenguo.mp4' },
            { name: '不妨', src: 'videos/bufang.mp4' },
            { name: '无罪', src: 'videos/wuzui.mp4' },
            { name: '凝视', src: 'videos/ningshi.mp4' },
            { name: '梦游', src: 'videos/mengyou.mp4' }
        ];
        if(this.list) this.init();
    }
    
    init() {
        this.renderList();
        // 确保 MediaPlayer 初始化时是全局可访问的，否则 HTML 中的 onclick 会报错
        window.mediaPlayer = this;
        if(this.mvs.length) this.load(0);
    }
    
    renderList() {
        this.list.innerHTML = this.mvs.map((mv, i) => `
            <li class="mv-item" onclick="mediaPlayer.load(${i})">
                <span class="mv-number">${i+1}</span>
                <span class="mv-name">${mv.name}</span>
                <button class="play-mv-btn">▶</button>
            </li>
        `).join('');
    }
    
    load(i) {
        if(i < 0 || i >= this.mvs.length) return;
        const mv = this.mvs[i];
        
        // 获取视频 URL（优先使用 Supabase Storage，否则使用本地路径）
        let videoUrl = mv.src;
        if (typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_STORAGE_URL) {
            // 使用 Supabase Storage URL
            const fileName = mv.src.replace('videos/', '');
            videoUrl = CONFIG.SUPABASE_STORAGE_URL + fileName;
        }
        
        // 加上时间戳防止缓存
        const timestamp = new Date().getTime();
        const src = videoUrl.includes('?') ? `${videoUrl}&t=${timestamp}` : `${videoUrl}?t=${timestamp}`;
        
        this.video.src = src;
        if(this.title) this.title.textContent = mv.name;
        
        // 高亮当前播放项
        Array.from(this.list.children).forEach((el, idx) => {
            el.classList.toggle('active', idx === i);
        });
    }
}

// 音乐播放器
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.playBtn = document.getElementById('playPauseBtn');
        this.disc = document.getElementById('vinylDisc');
        this.cover = document.getElementById('albumCoverImg');
        this.songs = [
            { name: '那些你教我的事', src: 'music/那些你教我的事.mp3', cover: 'images/covers/那些你教我的事.png' },
            { name: '梦未完待续', src: 'music/梦未完待续.mp3', cover: 'images/covers/梦未完待续.png' },
            { name: '你早就知道', src: 'music/你早就知道.mp3', cover: 'images/covers/你早就知道.png' },
            { name: '镜', src: 'music/镜.mp3', cover: 'images/covers/镜.png' },
            { name: '月朦胧鸟朦胧', src: 'music/月朦胧鸟朦胧.mp3', cover: 'images/covers/月朦胧鸟朦胧.png' },
            { name: '星火', src: 'music/星火.mp3', cover: 'images/covers/星火.png' },
            { name: '只怪相遇太美丽', src: 'music/只怪相遇太美丽.mp3', cover: 'images/covers/只怪相遇太美丽.png' },
            { name: '一个人过', src: 'music/一个人过.mp3', cover: 'images/covers/一个人过.png' },
            { name: '世界', src: 'music/世界.mp3', cover: 'images/covers/玩具.png' },
            { name: '凝视', src: 'music/凝视.mp3', cover: 'images/covers/玩具.png' },
            { name: '梦游', src: 'music/梦游.mp3', cover: 'images/covers/梦游.png' },
            { name: '自导自演', src: 'music/自导自演.mp3', cover: 'images/covers/自导自演.png' },
            { name: '入戏', src: 'music/入戏.mp3', cover: 'images/covers/入戏.png' },
            { name: '月光', src: 'music/月光.mp3', cover: 'images/covers/月光.png' },
            { name: '不妨', src: 'music/不妨.mp3', cover: 'images/covers/不妨.png' },
            { name: '刚好', src: 'music/刚好.mp3', cover: 'images/covers/刚好.png' },
            { name: '无罪', src: 'music/无罪.mp3', cover: 'images/covers/无罪.png' },
            { name: '我的世界只能容下一个你', src: 'music/我的世界只能容下一个你.mp3', cover: 'images/covers/我的世界只能容下一个你.png' }
        ];
        this.index = -1; // -1 表示没有选择歌曲，保持 initial 封面
        this.isPlaying = false;
        if(this.audio) this.init();
    }
    
    init() {
        // 确保 MusicPlayer 也是全局的，方便列表点击
        window.musicPlayer = this;
        this.renderList();
        
        this.playBtn.addEventListener('click', () => this.toggle());
        document.getElementById('prevSongBtn').onclick = () => this.skip(-1);
        document.getElementById('nextSongBtn').onclick = () => this.skip(1);
        
        this.audio.onended = () => {
            this.disc.classList.remove('playing');
            this.skip(1);
        };
        
        this.audio.onpause = () => this.disc.classList.remove('playing');
        this.audio.onplay = () => this.disc.classList.add('playing');
        
        this.audio.ontimeupdate = () => {
            const p = (this.audio.currentTime / this.audio.duration) * 100 || 0;
            document.getElementById('progressBar').value = p;
            document.getElementById('songTime').textContent = this.format(this.audio.currentTime) + ' / ' + this.format(this.audio.duration);
        };
        
        document.getElementById('progressBar').oninput = (e) => {
            const time = (e.target.value / 100) * this.audio.duration;
            this.audio.currentTime = time;
        };
        
        document.getElementById('volumeBar').oninput = (e) => this.audio.volume = e.target.value / 100;
        
        // 监听语言变化，更新"未选择歌曲"文本
        window.addEventListener('languageChanged', () => {
            this.updateNoSongText();
        });
        
        // 初始化"未选择歌曲"文本
        this.updateNoSongText();
        
        // 不自动加载第一首歌曲，保持 initial 封面
        // 只有当用户点击歌曲列表时才加载封面
    }
    
    updateNoSongText() {
        // 只有在没有选择歌曲时才更新文本
        if (this.index === -1) {
            const currentSongNameEl = document.getElementById('currentSongName');
            if (currentSongNameEl && languageManager) {
                currentSongNameEl.textContent = languageManager.t('music.noSong');
                // 确保有 data-i18n 属性，这样语言切换时能自动更新
                currentSongNameEl.setAttribute('data-i18n', 'music.noSong');
            }
        }
    }
    
    renderList() {
        document.getElementById('playlist').innerHTML = this.songs.map((s, i) => `
            <li class="song-item" onclick="musicPlayer.load(${i}, true)">
                <span class="song-number">${i+1}</span>
                <span class="song-name">${s.name}</span>
                <button class="play-song-btn">▶</button>
            </li>
        `).join('');
    }
    
    load(i, autoPlay) {
        this.index = i;
        const song = this.songs[i];
        
        // 加上时间戳
        const timestamp = new Date().getTime();
        const src = song.src.includes('?') ? `${song.src}&t=${timestamp}` : `${song.src}?t=${timestamp}`;
        
        this.audio.src = src;
        const currentSongNameEl = document.getElementById('currentSongName');
        currentSongNameEl.textContent = song.name;
        // 移除 data-i18n 属性，因为现在显示的是歌曲名称，不是翻译文本
        currentSongNameEl.removeAttribute('data-i18n');
        
        // 封面处理
        const coverSrc = song.cover.includes('?') ? `${song.cover}&t=${timestamp}` : `${song.cover}?t=${timestamp}`;
        this.cover.src = coverSrc;
        this.cover.onerror = () => { this.cover.src = 'images/covers/initial.png'; }; 
        
        // 列表高亮
        Array.from(document.getElementById('playlist').children).forEach((el, idx) => el.classList.toggle('active', idx === i));
        
        if(autoPlay) {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updateState();
            }).catch(e => console.log('Auto-play prevented:', e));
        }
    }
    
    toggle() {
        // 如果没有选择歌曲，提示用户先选择
        if (this.index === -1 || !this.audio.src) {
            // 如果歌曲列表不为空，自动加载第一首
            if (this.songs.length > 0) {
                this.load(0, true);
            }
            return;
        }
        
        if(this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updateState();
    }
    
    updateState() {
        // 使用CSS类切换图标显示
        if(this.isPlaying) {
            this.playBtn.classList.add('playing');
            this.disc.classList.add('playing');
        } else {
            this.playBtn.classList.remove('playing');
            this.disc.classList.remove('playing');
        }
    }
    
    skip(dir) {
        // 如果没有选择歌曲，从第一首或最后一首开始
        let i = this.index === -1 ? (dir > 0 ? 0 : this.songs.length - 1) : this.index + dir;
        if(i < 0) i = this.songs.length - 1;
        if(i >= this.songs.length) i = 0;
        this.load(i, true);
    }
    
    format(s) {
        if(isNaN(s)) return '00:00';
        const m = Math.floor(s/60);
        const sec = Math.floor(s%60);
        return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
    }
}

// 影视作品管理
class FilmWorksManager {
    constructor() {
        this.grid = document.getElementById('worksGrid');
        // 影视作品数据（共17部，按顺序排列）
        this.works = [
            { title: '太子妃升职记', role: '九王齐翰', image: 'images/works/九王.jpg' },
            { title: '三生三世十里桃花', role: '白真', image: 'images/works/白真.jpg' },
            { title: '轩辕剑之汉之云', role: '徐暮云', image: 'images/works/徐暮云.jpg' },
            { title: '霍去病', role: '李敢', image: 'images/works/李敢.jpg' },
            { title: '凉生, 我们可不可以不忧伤', role: '程天恩', image: 'images/works/程天恩.jpg' },
            { title: '谁的青春不叛逆', role: '鹿相', image: 'images/works/鹿相.jpg' },
            { title: '青春抛物线', role: '傅安晏', image: 'images/works/傅安晏.jpg' },
            { title: '新白娘子传奇', role: '许仙', image: 'images/works/许仙.jpg' },
            { title: '两世欢', role: '景辞', image: 'images/works/景辞.jpg' },
            { title: '明月曾照江东寒', role: '林放', image: 'images/works/林放.jpg' },
            { title: '大中医', role: '王陵直', image: 'images/works/王陵直.jpg' },
            { title: '约定', role: '陈有为', image: 'images/works/陈有为.jpg' },
            { title: '温德瑞拉日记', role: '单良', image: 'images/works/单良.jpg' },
            { title: '永夜星河', role: '李准', image: 'images/works/李准.jpg' },
            { title: '一伞烟雨', role: '南风意', image: 'images/works/南风意.jpg' },
            { title: '侠客行不通', role: '全能侠', image: 'images/works/全能侠.jpg' },
            { title: '临江仙', role: '玄天使者', image: 'images/works/玄天使者.jpg' }
        ];
        this.init();
    }
    init() {
        if(!this.grid) return;
        this.render();
        window.addEventListener('languageChanged', () => this.render());
    }
    render() {
        if(!this.works.length) {
            this.grid.innerHTML = '<div class="works-empty">暂无作品数据</div>';
            return;
        }
        const roleLabel = languageManager ? languageManager.t('works.role') : '饰演';
        this.grid.innerHTML = this.works.map(w => `
            <div class="work-card">
                <div class="work-image"><img src="${w.image}" loading="lazy" alt="${w.title}"></div>
                <div class="work-info">
                    <h3 class="work-title">${w.title}</h3>
                    <p class="work-role">${roleLabel}：${w.role}</p>
                </div>
            </div>
        `).join('');
    }
}

// 管理员系统
class AdminManager {
    constructor() {
        this.isLoggedIn = false;
        this.adminToken = null; // 管理员token
        this.loginModal = document.getElementById('adminLoginModal');
        this.panelModal = document.getElementById('adminPanelModal');
        this.messageBoard = null; // 将在初始化时设置
        this.failedAttempts = 0; // 失败尝试次数
        this.maxAttempts = 5; // 最大尝试次数
        this.lockoutTime = 15 * 60 * 1000; // 锁定15分钟（毫秒）
        this.lockedUntil = 0; // 锁定到期时间
        this.init();
    }
    
    getApiEndpoint() {
        return typeof CONFIG !== 'undefined' ? CONFIG.API_ENDPOINT : '/api';
    }
    
    init() {
        // 使用键盘快捷键打开管理员登录（更安全）
        // 快捷键：Ctrl + Shift + A（Mac: Cmd + Shift + A）
        let keySequence = [];
        let sequenceTimer = null;
        
        document.addEventListener('keydown', (e) => {
            // 检测 Ctrl+Shift+A (Windows/Linux) 或 Cmd+Shift+A (Mac)
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifierKey = isMac ? e.metaKey : e.ctrlKey;
            
            if (modifierKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
                e.preventDefault();
                this.openLogin();
                return;
            }
            
            // 备用方案：输入特定密码序列（更隐蔽）
            // 输入 "admin" 后按 Enter 打开登录（需要快速输入，3秒内）
            const validKeys = ['a', 'd', 'm', 'i', 'n'];
            if (validKeys.includes(e.key.toLowerCase()) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                keySequence.push(e.key.toLowerCase());
                
                // 只保留最后5个字符
                if (keySequence.length > 5) {
                    keySequence.shift();
                }
                
                // 检查是否输入了 "admin"
                if (keySequence.join('') === 'admin') {
                    this.openLogin();
                    keySequence = [];
                }
                
                // 3秒后重置序列
                clearTimeout(sequenceTimer);
                sequenceTimer = setTimeout(() => {
                    keySequence = [];
                }, 3000);
            } else if (e.key === 'Enter' && keySequence.length > 0) {
                // 如果输入了部分序列后按Enter，重置
                keySequence = [];
            }
        });
        
        // 登录按钮
        const loginBtn = document.getElementById('adminLoginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.login());
        }
        
        // 登录输入框回车
        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.login();
                }
            });
        }
        
        // 关闭登录模态框
        const closeLogin = document.getElementById('closeAdminLogin');
        if (closeLogin) {
            closeLogin.addEventListener('click', () => this.closeLogin());
        }
        
        // 关闭管理面板
        const closePanel = document.getElementById('closeAdminPanel');
        if (closePanel) {
            closePanel.addEventListener('click', () => this.closePanel());
        }
        
        // 退出登录
        const logoutBtn = document.getElementById('adminLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // 点击模态框外部关闭
        if (this.loginModal) {
            this.loginModal.addEventListener('click', (e) => {
                if (e.target === this.loginModal) {
                    this.closeLogin();
                }
            });
        }
        
        if (this.panelModal) {
            this.panelModal.addEventListener('click', (e) => {
                if (e.target === this.panelModal) {
                    this.closePanel();
                }
            });
        }
    }
    
    setMessageBoard(messageBoard) {
        this.messageBoard = messageBoard;
    }
    
    openLogin() {
        if (this.loginModal) {
            this.loginModal.classList.add('active');
            document.getElementById('adminPassword').focus();
        }
    }
    
    closeLogin() {
        if (this.loginModal) {
            this.loginModal.classList.remove('active');
            document.getElementById('adminPassword').value = '';
            document.getElementById('adminError').textContent = '';
        }
    }
    
    async login() {
        const password = document.getElementById('adminPassword').value;
        const errorEl = document.getElementById('adminError');
        const loginBtn = document.getElementById('adminLoginBtn');
        
        if (!password) {
            errorEl.textContent = '请输入密码';
            errorEl.style.display = 'block';
            return;
        }
        
        // 检查是否被锁定
        const now = Date.now();
        if (this.lockedUntil > now) {
            const remainingMinutes = Math.ceil((this.lockedUntil - now) / 60000);
            errorEl.textContent = `登录失败次数过多，请等待 ${remainingMinutes} 分钟后再试`;
            errorEl.style.display = 'block';
            loginBtn.disabled = true;
            return;
        }
        
        // 禁用按钮，显示加载状态
        loginBtn.disabled = true;
        loginBtn.textContent = '登录中...';
        
        try {
            const apiEndpoint = this.getApiEndpoint();
            const response = await fetch(`${apiEndpoint}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: password })
            });
            
            const result = await response.json();
            
            if (result.success && result.token) {
                // 登录成功
                this.failedAttempts = 0;
                this.lockedUntil = 0;
                this.isLoggedIn = true;
                this.adminToken = result.token;
                this.closeLogin();
                this.openPanel();
                // 保存登录状态到sessionStorage
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminToken', result.token);
            } else {
                // 登录失败
                this.failedAttempts++;
                const remainingAttempts = this.maxAttempts - this.failedAttempts;
                
                if (this.failedAttempts >= this.maxAttempts) {
                    // 达到最大尝试次数，锁定账户
                    this.lockedUntil = now + this.lockoutTime;
                    errorEl.textContent = `登录失败次数过多，账户已锁定15分钟`;
                    errorEl.style.display = 'block';
                    
                    // 15分钟后解锁
                    setTimeout(() => {
                        this.failedAttempts = 0;
                        this.lockedUntil = 0;
                        loginBtn.disabled = false;
                        loginBtn.textContent = '登录';
                        errorEl.style.display = 'none';
                    }, this.lockoutTime);
                } else {
                    errorEl.textContent = result.error || `密码错误，还有 ${remainingAttempts} 次尝试机会`;
                    errorEl.style.display = 'block';
                    setTimeout(() => {
                        errorEl.style.display = 'none';
                    }, 3000);
                }
            }
        } catch (error) {
            console.error('登录失败:', error);
            errorEl.textContent = '登录失败，请检查网络连接';
            errorEl.style.display = 'block';
            setTimeout(() => {
                errorEl.style.display = 'none';
            }, 3000);
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = '登录';
        }
    }
    
    logout() {
        this.isLoggedIn = false;
        this.adminToken = null;
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminToken');
        this.closePanel();
    }
    
    openPanel() {
        if (this.panelModal && this.isLoggedIn) {
            this.panelModal.classList.add('active');
            this.renderAdminMessages();
            
            // 初始化标签页切换
            this.initAdminTabs();
        }
    }
    
    initAdminTabs() {
        const tabMessages = document.getElementById('adminTabMessages');
        const tabFlowers = document.getElementById('adminTabFlowers');
        const contentMessages = document.getElementById('adminTabContentMessages');
        const contentFlowers = document.getElementById('adminTabContentFlowers');
        
        if (tabMessages && tabFlowers) {
            tabMessages.addEventListener('click', () => {
                tabMessages.classList.add('active');
                tabFlowers.classList.remove('active');
                contentMessages.classList.add('active');
                contentFlowers.classList.remove('active');
                this.renderAdminMessages();
            });
            
            tabFlowers.addEventListener('click', () => {
                tabFlowers.classList.add('active');
                tabMessages.classList.remove('active');
                contentFlowers.classList.add('active');
                contentMessages.classList.remove('active');
                this.renderAdminFlowers();
            });
        }
        
        // 刷新按钮
        const refreshBtn = document.getElementById('adminFlowerRefreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.renderAdminFlowers();
            });
        }
    }
    
    closePanel() {
        if (this.panelModal) {
            this.panelModal.classList.remove('active');
        }
    }
    
    async renderAdminMessages() {
        if (!this.isLoggedIn || !this.adminToken) {
            return;
        }
        
        try {
            const apiEndpoint = this.getApiEndpoint();
            const response = await fetch(`${apiEndpoint}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.adminToken}`
                }
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || '获取留言失败');
            }
            
            const messages = result.messages || [];
            const listEl = document.getElementById('adminMessagesList');
            const countEl = document.getElementById('adminTotalCount');
            
            if (countEl) {
                countEl.textContent = messages.length;
            }
            
            if (listEl) {
                if (messages.length === 0) {
                    listEl.innerHTML = '<p class="admin-empty">暂无留言</p>';
                    return;
                }
                
                // 按时间排序，最新的在前面
                const sortedMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp);
                
                listEl.innerHTML = sortedMessages.map(msg => {
                    const statusText = msg.status === 'pending' ? '（待审核）' : 
                                     msg.status === 'approved' ? '（已通过）' : '（已拒绝）';
                    const statusClass = msg.status === 'pending' ? 'admin-status-pending' : 
                                      msg.status === 'approved' ? 'admin-status-approved' : 'admin-status-rejected';
                    const timeStr = msg.timestamp ? this.formatDateTime(msg.timestamp) : (msg.time || '未知时间');
                    
                    return `
                        <div class="admin-message-item" data-id="${msg.id}">
                            <div class="admin-message-content">
                                <p class="admin-message-text">${this.escapeHtml(msg.text)}</p>
                                <div class="admin-message-meta">
                                    <span class="admin-message-time">${timeStr}</span>
                                    <span class="admin-status ${statusClass}">${statusText}</span>
                                </div>
                            </div>
                            <div class="admin-message-actions">
                                <button class="admin-approve-btn" onclick="window.adminManager.approveMessage(${msg.id})" ${msg.status === 'approved' ? 'disabled' : ''}>
                                    通过
                                </button>
                                <button class="admin-reject-btn" onclick="window.adminManager.rejectMessage(${msg.id})" ${msg.status === 'rejected' ? 'disabled' : ''}>
                                    拒绝
                                </button>
                                <button class="admin-delete-btn" onclick="window.adminManager.deleteMessage(${msg.id})">
                                    删除
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('获取留言失败:', error);
            const listEl = document.getElementById('adminMessagesList');
            if (listEl) {
                listEl.innerHTML = '<p class="admin-error">获取留言失败，请刷新重试</p>';
            }
        }
    }
    
    formatDateTime(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
    
    // 格式化送花记录的时间（基于 created_at 的真实时间戳，不篡改时间）
    formatFlowerRecordTime(createdAt) {
        if (!createdAt) return '未知时间';
        
        // 直接使用 created_at 的真实时间戳，转换为本地时区显示
        const date = new Date(createdAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        // 显示真实的送花时间（不篡改）
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
    
    async renderAdminFlowers() {
        if (!this.isLoggedIn || !this.adminToken) {
            return;
        }
        
        try {
            const apiEndpoint = this.getApiEndpoint();
            
            // 获取筛选条件
            const dateFilter = document.getElementById('adminFlowerDateFilter')?.value || '';
            const ipFilter = document.getElementById('adminFlowerIpFilter')?.value || '';
            
            // 构建查询参数
            const params = new URLSearchParams();
            if (dateFilter) params.append('date', dateFilter);
            if (ipFilter) params.append('user_ip', ipFilter);
            params.append('limit', '500');
            
            const response = await fetch(`${apiEndpoint}/flowers/records?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.adminToken}`
                }
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || '获取送花记录失败');
            }
            
            const records = result.records || [];
            const stats = result.stats || [];
            const listEl = document.getElementById('adminFlowersList');
            const countEl = document.getElementById('adminFlowerTotalCount');
            
            if (countEl) {
                countEl.textContent = records.length;
            }
            
            if (listEl) {
                if (records.length === 0) {
                    listEl.innerHTML = '<p class="admin-empty">暂无送花记录</p>';
                    return;
                }
                
                // 显示统计信息
                let html = '<div class="admin-flowers-stats">';
                html += '<h3>按日期和IP统计</h3>';
                html += '<div class="admin-flowers-stats-list">';
                
                stats.forEach(stat => {
                    html += `
                        <div class="admin-flower-stat-item">
                            <div class="stat-header">
                                <span class="stat-date">日期：${stat.date}</span>
                                <span class="stat-ip">IP：${stat.user_ip}</span>
                                <span class="stat-total">总计：${stat.total_count} 朵</span>
                            </div>
                            <div class="stat-records">
                                ${stat.records.map(r => `
                                    <div class="stat-record">
                                        <span>${r.flower_count} 朵</span>
                                        <span class="stat-time">${this.formatFlowerRecordTime(r.created_at)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                });
                
                html += '</div></div>';
                
                // 显示详细记录
                html += '<h3>详细记录</h3>';
                html += '<div class="admin-flowers-records-list">';
                html += records.map(record => {
                    // 基于 created_at 计算真实的日期
                    let realDate = record.date;
                    if (record.created_at) {
                        const dateObj = new Date(record.created_at);
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        realDate = `${year}-${month}-${day}`;
                    }
                    const createdTime = this.formatFlowerRecordTime(record.created_at);
                    return `
                        <div class="admin-flower-record-item">
                            <div class="record-info">
                                <span class="record-date">日期：${realDate}</span>
                                <span class="record-ip">IP：${record.user_ip}</span>
                                <span class="record-count">数量：${record.flower_count} 朵</span>
                                <span class="record-time">时间：${createdTime}</span>
                            </div>
                        </div>
                    `;
                }).join('');
                html += '</div>';
                
                listEl.innerHTML = html;
            }
        } catch (error) {
            console.error('获取送花记录失败:', error);
            const listEl = document.getElementById('adminFlowersList');
            if (listEl) {
                listEl.innerHTML = '<p class="admin-error">获取送花记录失败，请刷新重试</p>';
            }
        }
    }
    
    async approveMessage(id) {
        if (!confirm('确定要通过这条留言吗？通过后将在网站上显示。')) {
            return;
        }
        
        if (!this.adminToken) {
            alert('请先登录管理员账户');
            return;
        }
        
        try {
            const apiEndpoint = this.getApiEndpoint();
            const response = await fetch(`${apiEndpoint}/messages/manage`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    id: id,
                    action: 'approve'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('留言已通过审核');
                // 刷新列表和前端留言显示
                this.renderAdminMessages();
                if (this.messageBoard) {
                    this.messageBoard.loadMessages();
                }
            } else {
                throw new Error(result.error || '审核失败');
            }
        } catch (error) {
            console.error('审核留言失败:', error);
            alert('审核失败：' + (error.message || '请稍后重试'));
        }
    }
    
    async rejectMessage(id) {
        if (!confirm('确定要拒绝这条留言吗？拒绝后不会在网站上显示。')) {
            return;
        }
        
        if (!this.adminToken) {
            alert('请先登录管理员账户');
            return;
        }
        
        try {
            const apiEndpoint = this.getApiEndpoint();
            const response = await fetch(`${apiEndpoint}/messages/manage`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    id: id,
                    action: 'reject'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('留言已拒绝');
                // 刷新列表
                this.renderAdminMessages();
            } else {
                throw new Error(result.error || '操作失败');
            }
        } catch (error) {
            console.error('拒绝留言失败:', error);
            alert('操作失败：' + (error.message || '请稍后重试'));
        }
    }
    
    async deleteMessage(id) {
        if (!confirm('确定要删除这条留言吗？删除后将无法恢复。')) {
            return;
        }
        
        if (!this.adminToken) {
            alert('请先登录管理员账户');
            return;
        }
        
        try {
            const apiEndpoint = this.getApiEndpoint();
            const response = await fetch(`${apiEndpoint}/messages/manage`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    id: id
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('留言已删除');
                // 刷新列表和前端留言显示
                this.renderAdminMessages();
                if (this.messageBoard) {
                    this.messageBoard.loadMessages();
                }
            } else {
                throw new Error(result.error || '删除失败');
            }
        } catch (error) {
            console.error('删除留言失败:', error);
            alert('删除失败：' + (error.message || '请稍后重试'));
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    checkSession() {
        // 检查sessionStorage中的登录状态
        const token = sessionStorage.getItem('adminToken');
        if (token) {
            this.adminToken = token;
            this.isLoggedIn = true;
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 确保按顺序初始化
    languageManager = new LanguageManager();
    new NavbarAutoHide();
    new ModalManager();
    new ImageCarousel();
    const messageBoard = new MessageBoard();
    new FlowerSection();
    new MediaPlayer(); // 这里会初始化 window.mediaPlayer
    new MusicPlayer(); // 这里会初始化 window.musicPlayer
    new FilmWorksManager();
    
    // 初始化管理员系统
    window.adminManager = new AdminManager();
    window.adminManager.setMessageBoard(messageBoard);
    window.adminManager.checkSession();
});