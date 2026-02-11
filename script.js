// 模拟文章数据（稍后可以替换为真实数据）
const posts = [
    {
        title: "欢迎来到我的博客",
        date: "2026-02-11",
        excerpt: "这是我的第一篇博客文章，主要介绍这个博客的创建过程和未来计划。",
        url: "/posts/welcome.html"
    },
    {
        title: "Git 入门指南",
        date: "2026-02-11",
        excerpt: "分享一些 Git 的基础使用技巧和常见命令。",
        url: "/posts/git-guide.html"
    },
    {
        title: "Vim 基础操作",
        date: "2026-02-11",
        excerpt: "记录学习 Vim 编辑器的心得和常用快捷键。",
        url: "/posts/vim-basics.html"
    }
];

// 渲染文章列表
function renderPosts() {
    const container = document.getElementById('posts-container');
    
    if (!container) return;
    
    const postsHTML = posts.map(post => `
        <article class="post-item">
            <div class="post-date">
                <i class="far fa-calendar-alt"></i> ${post.date}
            </div>
            <a href="${post.url}" class="post-title">
                <h3>${post.title}</h3>
            </a>
            <p class="post-excerpt">${post.excerpt}</p>
            <a href="${post.url}" class="read-more">阅读全文 →</a>
        </article>
    `).join('');
    
    container.innerHTML = postsHTML;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    renderPosts();
    
    // 添加简单的交互效果
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('/')) {
                e.preventDefault();
                alert('这个页面还在建设中！');
            }
        });
    });
    
    // 更新版权年份
    const yearSpan = document.querySelector('footer p');
    if (yearSpan) {
        yearSpan.innerHTML = yearSpan.innerHTML.replace('2026', new Date().getFullYear());
    }
});
