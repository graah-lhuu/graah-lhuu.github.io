// ============================================
// 个人博客 - 主脚本文件
// 功能: 交互效果、数据加载、主题切换等
// ============================================

'use strict';

// 全局配置
const CONFIG = {
    siteName: 'XIA TAO',
    apiBase: '', // 如果使用API
    enableAnalytics: false, // 是否启用分析
    defaultTheme: 'auto', // auto, light, dark
    searchDebounce: 300, // 搜索防抖延迟(ms)
};

// DOM 元素引用
const DOM = {
    // 主题相关
    themeToggle: document.getElementById('theme-toggle'),
    html: document.documentElement,
    
    // 搜索相关
    searchBtn: document.getElementById('search-btn'),
    searchModal: document.getElementById('search-modal'),
    closeSearch: document.getElementById('close-search'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    
    // 导航相关
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    // 返回顶部
    backToTop: document.getElementById('back-to-top'),
    
    // 统计相关
    blogCount: document.getElementById('blog-count'),
    projectCount: document.getElementById('project-count'),
    bookCount: document.getElementById('book-count'),
    linkCount: document.getElementById('link-count'),
    visitCount: document.getElementById('visit-count'),
    blogLatest: document.getElementById('blog-latest'),
    
    // 最新内容
    latestBlogs: document.getElementById('latest-blogs'),
    latestBooks: document.getElementById('latest-books'),
};

// 模拟数据 (实际使用时应该从API或JSON文件加载)
const MOCK_DATA = {
    blogCount: 12,
    projectCount: 5,
    bookCount: 8,
    linkCount: 24,
    visitCount: 1532,
    latestBlogDate: '2026-02-11',
    latestPosts: [
        {
            title: 'Vim 高级技巧与配置优化',
            date: '2026-02-11',
            excerpt: '分享我在使用 Vim 过程中积累的高效编辑技巧和个性化配置方案...',
            category: '工具',
            url: '/blog/2026-02-11-vim-tips.html'
        },
        {
            title: 'Git 工作流最佳实践',
            date: '2026-02-10',
            excerpt: '团队协作中的 Git 工作流程管理和代码审查实践...',
            category: '开发',
            url: '/blog/2026-02-10-git-workflow.html'
        },
        {
            title: 'JavaScript ES2026 新特性前瞻',
            date: '2026-02-09',
            excerpt: '探索即将到来的 JavaScript 新特性和语言发展趋势...',
            category: '前端',
            url: '/blog/2026-02-09-js-es2026.html'
        }
    ],
    latestBooks: [
        {
            title: '深度工作',
            author: '卡尔·纽波特',
            rating: 4.5,
            date: '2026-02-10',
            excerpt: '在碎片化时代如何保持专注和高效',
            url: '/life/books/deep-work-review.html'
        },
        {
            title: '代码大全',
            author: '史蒂夫·迈克康奈尔',
            rating: 5,
            date: '2026-02-05',
            excerpt: '软件开发实践的经典指南',
            url: '/life/books/code-complete-review.html'
        },
        {
            title: '设计模式',
            author: '四人组',
            rating: 4,
            date: '2026-01-28',
            excerpt: '可复用面向对象软件的基础',
            url: '/life/books/design-patterns-review.html'
        }
    ]
};

// ============================================
// 初始化函数
// ============================================

/**
 * 初始化应用程序
 */
function initApp() {
    console.log(`${CONFIG.siteName} 博客初始化...`);
    
    // 初始化主题
    initTheme();
    
    // 初始化事件监听器
    initEventListeners();
    
    // 加载数据
    loadData();
    
    // 初始化打字机效果
    initTypewriter();
    
    // 初始化滚动监听
    initScrollHandlers();
    
    // 初始化搜索功能
    initSearch();
    
    console.log('博客初始化完成');
}

/**
 * 初始化事件监听器
 */
function initEventListeners() {
    // 主题切换
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // 搜索功能
    if (DOM.searchBtn && DOM.searchModal) {
        DOM.searchBtn.addEventListener('click', openSearch);
    }
    
    if (DOM.closeSearch) {
        DOM.closeSearch.addEventListener('click', closeSearch);
    }
    
    // 点击模态框外部关闭搜索
    DOM.searchModal?.addEventListener('click', (e) => {
        if (e.target === DOM.searchModal) {
            closeSearch();
        }
    });
    
    // 移动端菜单
    if (DOM.mobileMenuBtn) {
        DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // 返回顶部
    if (DOM.backToTop) {
        DOM.backToTop.addEventListener('click', scrollToTop);
    }
    
    // 导航链接激活状态
    updateActiveNavLink();
    
    // ESC键关闭搜索
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.searchModal.classList.contains('active')) {
            closeSearch();
        }
    });
}

// ============================================
// 主题管理
// ============================================

/**
 * 初始化主题设置
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || CONFIG.defaultTheme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let theme = savedTheme;
    
    if (theme === 'auto') {
        theme = prefersDark ? 'dark' : 'light';
    }
    
    setTheme(theme);
    updateThemeToggleIcon(theme);
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'auto') {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * 设置主题
 * @param {string} theme - 'light' 或 'dark'
 */
function setTheme(theme) {
    DOM.html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleIcon(theme);
}

/**
 * 切换主题
 */
function toggleTheme() {
    const currentTheme = DOM.html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 添加过渡动画
    DOM.html.style.transition = 'color 0.3s ease, background-color 0.3s ease';
    
    setTheme(newTheme);
    
    // 动画结束后移除过渡
    setTimeout(() => {
        DOM.html.style.transition = '';
    }, 300);
}

/**
 * 更新主题切换按钮图标
 * @param {string} theme - 当前主题
 */
function updateThemeToggleIcon(theme) {
    if (!DOM.themeToggle) return;
    
    const icon = DOM.themeToggle.querySelector('i');
    if (!icon) return;
    
    icon.className = theme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
    DOM.themeToggle.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
}

// ============================================
// 搜索功能
// ============================================

/**
 * 初始化搜索功能
 */
function initSearch() {
    if (!DOM.searchInput) return;
    
    let debounceTimer;
    
    DOM.searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            DOM.searchResults.innerHTML = '<div class="search-placeholder">输入至少2个字符开始搜索</div>';
            return;
        }
        
        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, CONFIG.searchDebounce);
    });
    
    // 初始提示
    DOM.searchResults.innerHTML = '<div class="search-placeholder">输入关键词搜索博客文章、项目等</div>';
}

/**
 * 执行搜索
 * @param {string} query - 搜索关键词
 */
function performSearch(query) {
    // 这里应该调用实际的搜索API
    // 目前使用模拟数据
    
    DOM.searchResults.innerHTML = '<div class="loading">搜索中...</div>';
    
    // 模拟网络延迟
    setTimeout(() => {
        const results = searchMockData(query);
        renderSearchResults(results, query);
    }, 300);
}

/**
 * 模拟搜索数据
 * @param {string} query - 搜索关键词
 * @returns {Array} 搜索结果
 */
function searchMockData(query) {
    const allItems = [
        ...MOCK_DATA.latestPosts.map(post => ({
            ...post,
            type: 'blog',
            icon: 'ri-article-line'
        })),
        ...MOCK_DATA.latestBooks.map(book => ({
            ...book,
            title: `${book.title} - ${book.author}`,
            type: 'book',
            icon: 'ri-book-line'
        }))
    ];
    
    const lowerQuery = query.toLowerCase();
    
    return allItems.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) ||
        item.excerpt.toLowerCase().includes(lowerQuery) ||
        (item.category && item.category.toLowerCase().includes(lowerQuery))
    );
}

/**
 * 渲染搜索结果
 * @param {Array} results - 搜索结果数组
 * @param {string} query - 搜索关键词
 */
function renderSearchResults(results, query) {
    if (!DOM.searchResults) return;
    
    if (results.length === 0) {
        DOM.searchResults.innerHTML = `
            <div class="no-results">
                <i class="ri-search-line"></i>
                <p>没有找到与 "<strong>${escapeHtml(query)}</strong>" 相关的结果</p>
                <p class="search-tip">尝试使用不同的关键词或检查拼写</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = results.map(item => `
        <a href="${item.url}" class="search-result-item">
            <div class="search-result-icon">
                <i class="${item.icon}"></i>
            </div>
            <div class="search-result-content">
                <h4 class="search-result-title">${escapeHtml(item.title)}</h4>
                <p class="search-result-excerpt">${escapeHtml(item.excerpt)}</p>
                <div class="search-result-meta">
                    <span class="search-result-type">${item.type === 'blog' ? '博客' : '书评'}</span>
                    <span class="search-result-date">${item.date}</span>
                </div>
            </div>
        </a>
    `).join('');
    
    DOM.searchResults.innerHTML = `
        <div class="search-results-header">
            <p>找到 <strong>${results.length}</strong> 个与 "<strong>${escapeHtml(query)}</strong>" 相关的结果</p>
        </div>
        <div class="search-results-list">
            ${resultsHTML}
        </div>
    `;
    
    // 添加搜索结果样式
    addSearchStyles();
}

/**
 * 添加搜索结果样式
 */
function addSearchStyles() {
    if (!document.getElementById('search-styles')) {
        const style = document.createElement('style');
        style.id = 'search-styles';
        style.textContent = `
            .search-placeholder, .no-results {
                text-align: center;
                padding: 2rem;
                color: var(--text-muted);
            }
            
            .no-results i {
                font-size: 3rem;
                margin-bottom: 1rem;
                display: block;
                opacity: 0.5;
            }
            
            .search-tip {
                font-size: 0.875rem;
                margin-top: 0.5rem;
                opacity: 0.7;
            }
            
            .search-results-header {
                padding: 0.5rem 0 1rem;
                border-bottom: 1px solid var(--border-color);
                margin-bottom: 1rem;
                font-size: 0.875rem;
                color: var(--text-muted);
            }
            
            .search-result-item {
                display: flex;
                gap: 1rem;
                padding: 1rem;
                border-radius: var(--radius-md);
                margin-bottom: 0.5rem;
                transition: background-color 0.2s;
                border: 1px solid transparent;
            }
            
            .search-result-item:hover {
                background-color: var(--bg-surface-alt);
                border-color: var(--border-color);
            }
            
            .search-result-icon {
                width: 2.5rem;
                height: 2.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--bg-surface-alt);
                border-radius: var(--radius-md);
                color: var(--color-primary);
                flex-shrink: 0;
            }
            
            .search-result-content {
                flex: 1;
            }
            
            .search-result-title {
                font-size: 0.875rem;
                font-weight: 500;
                margin-bottom: 0.25rem;
                color: var(--text-primary);
            }
            
            .search-result-excerpt {
                font-size: 0.75rem;
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .search-result-meta {
                display: flex;
                gap: 1rem;
                font-size: 0.7rem;
                color: var(--text-muted);
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * 打开搜索模态框
 */
function openSearch() {
    if (!DOM.searchModal) return;
    
    DOM.searchModal.classList.add('active');
    DOM.searchInput.focus();
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭搜索模态框
 */
function closeSearch() {
    if (!DOM.searchModal) return;
    
    DOM.searchModal.classList.remove('active');
    DOM.searchInput.value = '';
    DOM.searchResults.innerHTML = '<div class="search-placeholder">输入关键词搜索博客文章、项目等</div>';
    document.body.style.overflow = '';
}

// ============================================
// 数据加载
// ============================================

/**
 * 加载和显示数据
 */
function loadData() {
    // 更新统计数据
    if (DOM.blogCount) DOM.blogCount.textContent = MOCK_DATA.blogCount;
    if (DOM.projectCount) DOM.projectCount.textContent = MOCK_DATA.projectCount;
    if (DOM.bookCount) DOM.bookCount.textContent = MOCK_DATA.bookCount;
    if (DOM.linkCount) DOM.linkCount.textContent = MOCK_DATA.linkCount;
    if (DOM.visitCount) DOM.visitCount.textContent = formatNumber(MOCK_DATA.visitCount);
    if (DOM.blogLatest) DOM.blogLatest.textContent = MOCK_DATA.latestBlogDate;
    
    // 加载最新博客
    loadLatestBlogs();
    
    // 加载最新书籍
    loadLatestBooks();
    
    // 初始化访问计数
    updateVisitCount();
}

/**
 * 加载最新博客文章
 */
function loadLatestBlogs() {
    if (!DOM.latestBlogs) return;
    
    setTimeout(() => {
        const blogsHTML = MOCK_DATA.latestPosts.map(post => `
            <div class="latest-post">
                <a href="${post.url}" class="latest-post-title">${escapeHtml(post.title)}</a>
                <div class="latest-post-meta">
                    <span class="latest-post-date">${post.date}</span>
                    <span class="latest-post-category">${post.category}</span>
                </div>
                <p class="latest-post-excerpt">${escapeHtml(post.excerpt)}</p>
            </div>
        `).join('');
        
        DOM.latestBlogs.innerHTML = blogsHTML;
        
        // 添加样式
        addLatestBlogsStyles();
    }, 500);
}

/**
 * 加载最新书籍
 */
function loadLatestBooks() {
    if (!DOM.latestBooks) return;
    
    setTimeout(() => {
        const booksHTML = MOCK_DATA.latestBooks.map(book => `
            <div class="latest-book">
                <div class="latest-book-header">
                    <a href="${book.url}" class="latest-book-title">${escapeHtml(book.title)}</a>
                    <div class="latest-book-rating">
                        ${generateStarRating(book.rating)}
                    </div>
                </div>
                <div class="latest-book-meta">
                    <span class="latest-book-author">${escapeHtml(book.author)}</span>
                    <span class="latest-book-date">${book.date}</span>
                </div>
                <p class="latest-book-excerpt">${escapeHtml(book.excerpt)}</p>
            </div>
        `).join('');
        
        DOM.latestBooks.innerHTML = booksHTML;
        
        // 添加样式
        addLatestBooksStyles();
    }, 700);
}

/**
 * 更新访问计数
 */
function updateVisitCount() {
    // 这里应该调用API更新访问计数
    // 目前只是模拟
    
    let visits = localStorage.getItem('site_visits') || MOCK_DATA.visitCount;
    visits = parseInt(visits) + 1;
    localStorage.setItem('site_visits', visits);
    
    if (DOM.visitCount) {
        DOM.visitCount.textContent = formatNumber(visits);
    }
}

// ============================================
// UI交互功能
// ============================================

/**
 * 初始化打字机效果
 */
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;
    
    const words = ['记录', '分享', '成长', '创造', '探索'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // 删除字符
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // 输入字符
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            // 单词输入完成，暂停后开始删除
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            // 单词删除完成，切换到下一个单词
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // 延迟开始动画
    setTimeout(type, 1000);
}

/**
 * 初始化滚动处理
 */
function initScrollHandlers() {
    // 返回顶部按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            DOM.backToTop?.classList.add('visible');
        } else {
            DOM.backToTop?.classList.remove('visible');
        }
        
        // 更新导航栏激活状态
        updateActiveNavLink();
    });
}

/**
 * 更新导航链接激活状态
 */
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    
    DOM.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === '/') {
            link.classList.toggle('active', currentPath === '/' || currentPath === '/index.html');
        } else if (href && currentPath.startsWith(href) && href !== '/') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * 切换移动端菜单
 */
function toggleMobileMenu() {
    const navMenu = document