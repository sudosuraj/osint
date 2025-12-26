// OSINT Suite v2.0 - Professional Intelligence Toolkit
// All client-side processing - no backend required

// ==================== Global State ====================
let reportData = [];
let generatedDorks = [];
let generatedEmails = [];
let generatedSubdomains = [];
let generatedUsernameLinks = [];
let extractedMetadata = {};
let metadataMap = null;

// ==================== Platform Database ====================
const platforms = {
    social: [
        { name: 'Twitter/X', url: 'https://twitter.com/{username}', icon: 'fab fa-twitter' },
        { name: 'Instagram', url: 'https://instagram.com/{username}', icon: 'fab fa-instagram' },
        { name: 'Facebook', url: 'https://facebook.com/{username}', icon: 'fab fa-facebook' },
        { name: 'TikTok', url: 'https://tiktok.com/@{username}', icon: 'fab fa-tiktok' },
        { name: 'Snapchat', url: 'https://snapchat.com/add/{username}', icon: 'fab fa-snapchat' },
        { name: 'Pinterest', url: 'https://pinterest.com/{username}', icon: 'fab fa-pinterest' },
        { name: 'Tumblr', url: 'https://{username}.tumblr.com', icon: 'fab fa-tumblr' },
        { name: 'Reddit', url: 'https://reddit.com/user/{username}', icon: 'fab fa-reddit' },
        { name: 'VK', url: 'https://vk.com/{username}', icon: 'fab fa-vk' },
        { name: 'Mastodon', url: 'https://mastodon.social/@{username}', icon: 'fab fa-mastodon' },
        { name: 'Threads', url: 'https://threads.net/@{username}', icon: 'fas fa-at' },
        { name: 'Bluesky', url: 'https://bsky.app/profile/{username}', icon: 'fas fa-cloud' }
    ],
    professional: [
        { name: 'LinkedIn', url: 'https://linkedin.com/in/{username}', icon: 'fab fa-linkedin' },
        { name: 'AngelList', url: 'https://angel.co/u/{username}', icon: 'fab fa-angellist' },
        { name: 'Crunchbase', url: 'https://crunchbase.com/person/{username}', icon: 'fas fa-briefcase' },
        { name: 'About.me', url: 'https://about.me/{username}', icon: 'fas fa-user' },
        { name: 'Gravatar', url: 'https://gravatar.com/{username}', icon: 'fas fa-user-circle' },
        { name: 'Keybase', url: 'https://keybase.io/{username}', icon: 'fab fa-keybase' }
    ],
    development: [
        { name: 'GitHub', url: 'https://github.com/{username}', icon: 'fab fa-github' },
        { name: 'GitLab', url: 'https://gitlab.com/{username}', icon: 'fab fa-gitlab' },
        { name: 'Bitbucket', url: 'https://bitbucket.org/{username}', icon: 'fab fa-bitbucket' },
        { name: 'Stack Overflow', url: 'https://stackoverflow.com/users/{username}', icon: 'fab fa-stack-overflow' },
        { name: 'Dev.to', url: 'https://dev.to/{username}', icon: 'fab fa-dev' },
        { name: 'CodePen', url: 'https://codepen.io/{username}', icon: 'fab fa-codepen' },
        { name: 'Replit', url: 'https://replit.com/@{username}', icon: 'fas fa-code' },
        { name: 'HackerRank', url: 'https://hackerrank.com/{username}', icon: 'fab fa-hackerrank' },
        { name: 'LeetCode', url: 'https://leetcode.com/{username}', icon: 'fas fa-code' },
        { name: 'Kaggle', url: 'https://kaggle.com/{username}', icon: 'fab fa-kaggle' },
        { name: 'npm', url: 'https://npmjs.com/~{username}', icon: 'fab fa-npm' },
        { name: 'Docker Hub', url: 'https://hub.docker.com/u/{username}', icon: 'fab fa-docker' }
    ],
    gaming: [
        { name: 'Steam', url: 'https://steamcommunity.com/id/{username}', icon: 'fab fa-steam' },
        { name: 'Twitch', url: 'https://twitch.tv/{username}', icon: 'fab fa-twitch' },
        { name: 'Discord', url: 'https://discord.com/users/{username}', icon: 'fab fa-discord' },
        { name: 'Xbox', url: 'https://xboxgamertag.com/search/{username}', icon: 'fab fa-xbox' },
        { name: 'PlayStation', url: 'https://psnprofiles.com/{username}', icon: 'fab fa-playstation' },
        { name: 'Chess.com', url: 'https://chess.com/member/{username}', icon: 'fas fa-chess' }
    ],
    media: [
        { name: 'YouTube', url: 'https://youtube.com/@{username}', icon: 'fab fa-youtube' },
        { name: 'Vimeo', url: 'https://vimeo.com/{username}', icon: 'fab fa-vimeo' },
        { name: 'Flickr', url: 'https://flickr.com/people/{username}', icon: 'fab fa-flickr' },
        { name: 'DeviantArt', url: 'https://{username}.deviantart.com', icon: 'fab fa-deviantart' },
        { name: 'Behance', url: 'https://behance.net/{username}', icon: 'fab fa-behance' },
        { name: 'Dribbble', url: 'https://dribbble.com/{username}', icon: 'fab fa-dribbble' },
        { name: 'Unsplash', url: 'https://unsplash.com/@{username}', icon: 'fas fa-camera' }
    ],
    finance: [
        { name: 'Patreon', url: 'https://patreon.com/{username}', icon: 'fab fa-patreon' },
        { name: 'Ko-fi', url: 'https://ko-fi.com/{username}', icon: 'fas fa-coffee' },
        { name: 'PayPal.me', url: 'https://paypal.me/{username}', icon: 'fab fa-paypal' },
        { name: 'Venmo', url: 'https://venmo.com/{username}', icon: 'fas fa-dollar-sign' }
    ],
    music: [
        { name: 'Spotify', url: 'https://open.spotify.com/user/{username}', icon: 'fab fa-spotify' },
        { name: 'SoundCloud', url: 'https://soundcloud.com/{username}', icon: 'fab fa-soundcloud' },
        { name: 'Bandcamp', url: 'https://{username}.bandcamp.com', icon: 'fab fa-bandcamp' },
        { name: 'Last.fm', url: 'https://last.fm/user/{username}', icon: 'fab fa-lastfm' }
    ],
    forums: [
        { name: 'Hacker News', url: 'https://news.ycombinator.com/user?id={username}', icon: 'fab fa-hacker-news' },
        { name: 'Product Hunt', url: 'https://producthunt.com/@{username}', icon: 'fab fa-product-hunt' },
        { name: 'Quora', url: 'https://quora.com/profile/{username}', icon: 'fab fa-quora' },
        { name: 'Medium', url: 'https://medium.com/@{username}', icon: 'fab fa-medium' },
        { name: 'Imgur', url: 'https://imgur.com/user/{username}', icon: 'fas fa-image' }
    ],
    other: [
        { name: 'Linktree', url: 'https://linktr.ee/{username}', icon: 'fas fa-tree' },
        { name: 'Telegram', url: 'https://t.me/{username}', icon: 'fab fa-telegram' },
        { name: 'Goodreads', url: 'https://goodreads.com/{username}', icon: 'fab fa-goodreads' },
        { name: 'Letterboxd', url: 'https://letterboxd.com/{username}', icon: 'fas fa-film' },
        { name: 'Archive.org', url: 'https://archive.org/details/@{username}', icon: 'fas fa-archive' }
    ]
};

// ==================== Subdomain Wordlists ====================
const subdomainWordlists = {
    common: ['www', 'mail', 'ftp', 'webmail', 'smtp', 'pop', 'ns1', 'ns2', 'dns', 'mx', 'email', 'remote', 'blog', 'server', 'secure', 'vpn', 'shop', 'store', 'web', 'support', 'home', 'news', 'portal', 'cloud'],
    dev: ['dev', 'development', 'staging', 'stage', 'test', 'testing', 'qa', 'uat', 'sandbox', 'demo', 'preview', 'beta', 'alpha', 'preprod', 'ci', 'cd', 'build', 'jenkins', 'gitlab', 'github', 'git'],
    api: ['api', 'api1', 'api2', 'apis', 'rest', 'graphql', 'gateway', 'proxy', 'backend', 'service', 'services', 'ws', 'websocket', 'oauth', 'auth', 'sso', 'login', 'signin', 'account'],
    admin: ['admin', 'administrator', 'panel', 'dashboard', 'manage', 'management', 'console', 'control', 'cpanel', 'webadmin', 'sysadmin', 'backoffice', 'internal', 'staff', 'hr', 'billing'],
    mail: ['mail', 'email', 'smtp', 'pop', 'pop3', 'imap', 'mx', 'mailserver', 'webmail', 'postfix', 'exchange', 'outlook', 'autodiscover', 'newsletter'],
    cloud: ['aws', 'azure', 'gcp', 'cloud', 'cdn', 's3', 'storage', 'bucket', 'static', 'assets', 'media', 'images', 'files', 'download', 'upload', 'backup', 'lambda', 'docker', 'k8s', 'kubernetes'],
    database: ['db', 'database', 'mysql', 'postgres', 'mongo', 'redis', 'elastic', 'elasticsearch', 'kibana', 'sql', 'phpmyadmin', 'adminer', 'pgadmin'],
    monitoring: ['grafana', 'kibana', 'prometheus', 'nagios', 'zabbix', 'logs', 'logging', 'metrics', 'monitor', 'monitoring', 'status', 'health', 'uptime', 'sentry']
};

// ==================== Dork Templates ====================
const dorkTemplates = {
    sensitive: {
        name: 'Sensitive Files',
        dorks: [
            'site:{target} filetype:env',
            'site:{target} filetype:sql',
            'site:{target} filetype:log',
            'site:{target} filetype:bak',
            'site:{target} filetype:conf',
            'site:{target} "password" filetype:txt',
            'site:{target} "api_key" OR "apikey"',
            'site:{target} "secret" filetype:json'
        ]
    },
    admin: {
        name: 'Admin Panels',
        dorks: [
            'site:{target} inurl:admin',
            'site:{target} inurl:login',
            'site:{target} inurl:dashboard',
            'site:{target} inurl:panel',
            'site:{target} intitle:"admin login"',
            'site:{target} inurl:wp-admin',
            'site:{target} inurl:administrator'
        ]
    },
    directories: {
        name: 'Open Directories',
        dorks: [
            'site:{target} intitle:"index of"',
            'site:{target} intitle:"directory listing"',
            'site:{target} intitle:"parent directory"',
            'site:{target} "directory listing for"',
            'site:{target} inurl:/listing/'
        ]
    },
    github: {
        name: 'GitHub Secrets',
        dorks: [
            '{target} password filename:.env',
            '{target} api_key filename:.env',
            '{target} secret filename:config',
            '{target} AWS_SECRET_ACCESS_KEY',
            '{target} PRIVATE_KEY',
            '{target} "BEGIN RSA PRIVATE KEY"'
        ]
    },
    cloud: {
        name: 'Cloud Storage',
        dorks: [
            'site:s3.amazonaws.com {target}',
            'site:blob.core.windows.net {target}',
            'site:storage.googleapis.com {target}',
            'site:digitaloceanspaces.com {target}',
            'inurl:s3 {target}'
        ]
    },
    cameras: {
        name: 'IP Cameras',
        dorks: [
            'site:{target} inurl:ViewerFrame',
            'site:{target} intitle:"Live View"',
            'site:{target} inurl:view/index.shtml',
            'site:{target} intitle:"webcam"',
            'site:{target} inurl:lvappl'
        ]
    }
};

// ==================== Initialize Application ====================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initUniversalInput();
    initToggleItems();
    initDragDrop();
    updatePlatformCount();
    updateLivePreview();
});

// ==================== Navigation ====================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const moduleId = this.dataset.module;
            switchModule(moduleId);
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            if (window.innerWidth <= 1024) {
                toggleSidebar();
            }
        });
    });
}

function switchModule(moduleId) {
    const modules = document.querySelectorAll('.module');
    modules.forEach(mod => mod.classList.remove('active'));
    
    const targetModule = document.getElementById(moduleId);
    if (targetModule) {
        targetModule.classList.add('active');
        updateBreadcrumbs(moduleId);
    }
}

function updateBreadcrumbs(moduleId) {
    const moduleNames = {
        dorks: { category: 'Reconnaissance', name: 'Dork Generator' },
        username: { category: 'Reconnaissance', name: 'Username OSINT' },
        subdomain: { category: 'Reconnaissance', name: 'Subdomain Gen' },
        email: { category: 'Transform', name: 'Email Permutator' },
        hash: { category: 'Transform', name: 'Hash Tools' },
        ip: { category: 'Transform', name: 'IP Calculator' },
        metadata: { category: 'Analysis', name: 'Metadata Viewer' },
        regex: { category: 'Analysis', name: 'Regex Tester' },
        links: { category: 'Resources', name: 'External Tools' }
    };
    
    const info = moduleNames[moduleId] || { category: 'Tools', name: moduleId };
    document.getElementById('currentModule').textContent = info.category;
    document.getElementById('currentTool').textContent = info.name;
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// ==================== Universal Input ====================
function initUniversalInput() {
    const input = document.getElementById('universalInput');
    const suggestions = document.getElementById('universalSuggestions');
    
    input.addEventListener('input', function() {
        const value = this.value.trim();
        if (value.length > 2) {
            const detected = detectEntityType(value);
            showSuggestions(detected, value);
        } else {
            suggestions.classList.remove('active');
        }
    });
    
    input.addEventListener('blur', function() {
        setTimeout(() => suggestions.classList.remove('active'), 200);
    });
}

function detectEntityType(value) {
    const patterns = {
        ip: /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/,
        ipv6: /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        domain: /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
        md5: /^[a-fA-F0-9]{32}$/,
        sha1: /^[a-fA-F0-9]{40}$/,
        sha256: /^[a-fA-F0-9]{64}$/,
        url: /^https?:\/\/.+/,
        username: /^[a-zA-Z0-9_-]{3,30}$/
    };
    
    const detected = [];
    
    if (patterns.ip.test(value)) {
        detected.push({ type: 'IP Address', module: 'ip', icon: 'fas fa-network-wired' });
    }
    if (patterns.email.test(value)) {
        detected.push({ type: 'Email', module: 'email', icon: 'fas fa-envelope' });
    }
    if (patterns.domain.test(value)) {
        detected.push({ type: 'Domain', module: 'dorks', icon: 'fas fa-globe' });
        detected.push({ type: 'Domain', module: 'subdomain', icon: 'fas fa-sitemap' });
    }
    if (patterns.md5.test(value) || patterns.sha1.test(value) || patterns.sha256.test(value)) {
        detected.push({ type: 'Hash', module: 'hash', icon: 'fas fa-hashtag' });
    }
    if (patterns.username.test(value) && !patterns.domain.test(value)) {
        detected.push({ type: 'Username', module: 'username', icon: 'fas fa-user' });
    }
    
    return detected;
}

function showSuggestions(detected, value) {
    const container = document.getElementById('universalSuggestions');
    
    if (detected.length === 0) {
        container.classList.remove('active');
        return;
    }
    
    const moduleLabels = {
        ip: 'IP Calculator',
        email: 'Email Permutator',
        dorks: 'Dork Generator',
        subdomain: 'Subdomain Generator',
        hash: 'Hash Tools',
        username: 'Username OSINT'
    };
    
    container.innerHTML = detected.map(d => `
        <button class="suggestion-item" onclick="useSuggestion('${d.module}', '${value}')">
            <i class="${d.icon}"></i>
            <span>Open in ${moduleLabels[d.module]}</span>
            <small>${d.type} detected</small>
        </button>
    `).join('');
    
    container.classList.add('active');
}

function useSuggestion(module, value) {
    document.getElementById('universalSuggestions').classList.remove('active');
    document.getElementById('universalInput').value = '';
    
    const navItem = document.querySelector(`[data-module="${module}"]`);
    if (navItem) navItem.click();
    
    setTimeout(() => {
        switch(module) {
            case 'ip':
                document.getElementById('ipInput').value = value;
                calculateIP();
                break;
            case 'dorks':
                document.getElementById('dorkTarget').value = value;
                updateLivePreview();
                break;
            case 'subdomain':
                document.getElementById('subdomainDomain').value = value;
                break;
            case 'username':
                document.getElementById('usernameInput').value = value;
                break;
            case 'hash':
                document.getElementById('hashInput').value = value;
                break;
            case 'email':
                const parts = value.split('@');
                if (parts.length === 2) {
                    document.getElementById('emailDomain').value = parts[1];
                }
                break;
        }
    }, 100);
}

// ==================== Toggle Items ====================
function initToggleItems() {
    document.querySelectorAll('.toggle-item').forEach(item => {
        item.addEventListener('click', function() {
            const input = this.querySelector('input');
            if (input.type === 'checkbox') {
                input.checked = !input.checked;
                this.classList.toggle('active', input.checked);
            } else if (input.type === 'radio') {
                const group = this.closest('.toggle-group');
                group.querySelectorAll('.toggle-item').forEach(i => i.classList.remove('active'));
                input.checked = true;
                this.classList.add('active');
            }
            updatePlatformCount();
        });
    });
}

function toggleSwitch(element) {
    element.classList.toggle('active');
    updateLivePreview();
}

// ==================== Dork Generator ====================
function updateLivePreview() {
    const target = document.getElementById('dorkTarget').value || 'example.com';
    const fileTypes = document.getElementById('dorkFileTypes').value;
    const keywords = document.getElementById('dorkKeywords').value;
    
    let dork = '';
    
    document.querySelectorAll('#dorks .switch.active').forEach(sw => {
        const op = sw.dataset.operator;
        if (op === 'site:') {
            dork += `site:${target} `;
        } else if (op === 'filetype:' && fileTypes) {
            const types = fileTypes.split(',').map(t => t.trim()).filter(t => t);
            if (types.length > 0) {
                dork += types.map(t => `filetype:${t}`).join(' OR ') + ' ';
            }
        } else if (op === 'inurl:') {
            dork += 'inurl:admin ';
        } else if (op === 'intitle:') {
            dork += 'intitle:"index of" ';
        } else if (op === 'intext:' && keywords) {
            const kws = keywords.split(',').map(k => k.trim()).filter(k => k);
            if (kws.length > 0) {
                dork += kws.map(k => `intext:${k}`).join(' OR ') + ' ';
            }
        }
    });
    
    document.getElementById('dorkPreview').textContent = dork.trim() || 'Configure parameters to build your dork';
}

function generateDorks() {
    const target = document.getElementById('dorkTarget').value.trim();
    if (!target) {
        showToast('Please enter a target domain or keyword', 'error');
        return;
    }
    
    const engine = document.querySelector('input[name="engine"]:checked').value;
    const fileTypes = document.getElementById('dorkFileTypes').value.split(',').map(t => t.trim()).filter(t => t);
    const keywords = document.getElementById('dorkKeywords').value.split(',').map(k => k.trim()).filter(k => k);
    
    generatedDorks = [];
    
    const activeSwitches = document.querySelectorAll('#dorks .switch.active');
    activeSwitches.forEach(sw => {
        const op = sw.dataset.operator;
        if (op === 'site:') {
            generatedDorks.push(`site:${target}`);
        }
        if (op === 'filetype:' && fileTypes.length > 0) {
            fileTypes.forEach(ft => {
                generatedDorks.push(`site:${target} filetype:${ft}`);
            });
        }
        if (op === 'inurl:') {
            ['admin', 'login', 'dashboard', 'config', 'backup'].forEach(path => {
                generatedDorks.push(`site:${target} inurl:${path}`);
            });
        }
        if (op === 'intitle:') {
            ['index of', 'admin', 'login', 'dashboard'].forEach(title => {
                generatedDorks.push(`site:${target} intitle:"${title}"`);
            });
        }
        if (op === 'intext:' && keywords.length > 0) {
            keywords.forEach(kw => {
                generatedDorks.push(`site:${target} intext:${kw}`);
            });
        }
    });
    
    if (generatedDorks.length === 0) {
        generatedDorks.push(`site:${target}`);
    }
    
    displayDorks(engine);
    showToast(`Generated ${generatedDorks.length} dorks`, 'success');
}

function displayDorks(engine) {
    const container = document.getElementById('dorkList');
    const resultsDiv = document.getElementById('dorkResults');
    
    const searchUrls = {
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        github: 'https://github.com/search?q=',
        shodan: 'https://www.shodan.io/search?query='
    };
    
    const baseUrl = searchUrls[engine] || searchUrls.google;
    
    container.innerHTML = generatedDorks.map(dork => `
        <div class="result-item">
            <code>${dork}</code>
            <div class="result-actions">
                <button class="btn btn-icon btn-secondary" onclick="copyToClipboard('${dork.replace(/'/g, "\\'")}')" title="Copy">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn btn-icon btn-secondary" onclick="window.open('${baseUrl}${encodeURIComponent(dork)}', '_blank')" title="Search">
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button class="btn btn-icon btn-secondary add-to-report" onclick="addToReport('dork', '${dork.replace(/'/g, "\\'")}')" title="Add to Report">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    document.getElementById('dorkCount').textContent = generatedDorks.length;
    resultsDiv.style.display = 'block';
}

function useDorkTemplate(templateKey) {
    const template = dorkTemplates[templateKey];
    if (!template) return;
    
    const target = document.getElementById('dorkTarget').value.trim() || 'example.com';
    generatedDorks = template.dorks.map(d => d.replace(/{target}/g, target));
    
    displayDorks('google');
    showToast(`Loaded ${template.name} template`, 'success');
}

function copyAndOpenDork() {
    const dork = document.getElementById('dorkPreview').textContent;
    const engine = document.querySelector('input[name="engine"]:checked').value;
    
    const searchUrls = {
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        github: 'https://github.com/search?q=',
        shodan: 'https://www.shodan.io/search?query='
    };
    
    copyToClipboard(dork);
    window.open(searchUrls[engine] + encodeURIComponent(dork), '_blank');
}

function copyAllDorks() {
    copyToClipboard(generatedDorks.join('\n'));
    showToast('All dorks copied to clipboard', 'success');
}

function addDorksToReport() {
    generatedDorks.forEach(dork => addToReport('dork', dork));
    showToast(`Added ${generatedDorks.length} dorks to report`, 'success');
}

// ==================== Username OSINT ====================
function updatePlatformCount() {
    const checkboxes = document.querySelectorAll('#platformCategories input[type="checkbox"]:checked');
    let count = 0;
    checkboxes.forEach(cb => {
        const category = cb.value;
        if (platforms[category]) {
            count += platforms[category].length;
        }
    });
    document.getElementById('platformsSelected').textContent = count;
}

function searchUsername() {
    const username = document.getElementById('usernameInput').value.trim();
    if (!username) {
        showToast('Please enter a username', 'error');
        return;
    }
    
    const selectedCategories = Array.from(
        document.querySelectorAll('#platformCategories input[type="checkbox"]:checked')
    ).map(cb => cb.value);
    
    generatedUsernameLinks = [];
    
    selectedCategories.forEach(category => {
        if (platforms[category]) {
            platforms[category].forEach(platform => {
                generatedUsernameLinks.push({
                    name: platform.name,
                    url: platform.url.replace('{username}', username),
                    icon: platform.icon,
                    category: category
                });
            });
        }
    });
    
    displayUsernameLinks();
    showToast(`Generated ${generatedUsernameLinks.length} profile links`, 'success');
}

function displayUsernameLinks() {
    const container = document.getElementById('usernameList');
    const resultsDiv = document.getElementById('usernameResults');
    
    container.innerHTML = generatedUsernameLinks.map(link => `
        <div class="platform-item">
            <div class="platform-status pending">
                <i class="${link.icon}" style="font-size: 0.7rem;"></i>
            </div>
            <div class="platform-info">
                <div class="platform-name">${link.name}</div>
                <div class="platform-url">${link.url}</div>
            </div>
            <div class="platform-action">
                <button class="btn btn-icon btn-secondary" onclick="window.open('${link.url}', '_blank')" title="Open">
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button class="btn btn-icon btn-secondary add-to-report" onclick="addToReport('username', '${link.name}: ${link.url}')" title="Add to Report">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    document.getElementById('usernameCount').textContent = generatedUsernameLinks.length;
    document.getElementById('linksGenerated').textContent = generatedUsernameLinks.length;
    resultsDiv.style.display = 'block';
}

function openAllUsernameLinks() {
    if (generatedUsernameLinks.length > 10) {
        if (!confirm(`This will open ${generatedUsernameLinks.length} tabs. Continue?`)) {
            return;
        }
    }
    generatedUsernameLinks.forEach(link => {
        window.open(link.url, '_blank');
    });
}

function selectAllPlatforms() {
    document.querySelectorAll('#platformCategories .toggle-item').forEach(item => {
        const input = item.querySelector('input');
        input.checked = true;
        item.classList.add('active');
    });
    updatePlatformCount();
}

function addUsernameToReport() {
    generatedUsernameLinks.forEach(link => {
        addToReport('username', `${link.name}: ${link.url}`);
    });
    showToast(`Added ${generatedUsernameLinks.length} links to report`, 'success');
}

// ==================== Email Permutator ====================
function generateEmails() {
    const firstName = document.getElementById('firstName').value.trim().toLowerCase();
    const middleName = document.getElementById('middleName').value.trim().toLowerCase();
    const lastName = document.getElementById('lastName').value.trim().toLowerCase();
    const domain = document.getElementById('emailDomain').value.trim().toLowerCase();
    
    if (!firstName || !lastName || !domain) {
        showToast('Please enter first name, last name, and domain', 'error');
        return;
    }
    
    generatedEmails = [];
    const f = firstName;
    const m = middleName;
    const l = lastName;
    const fi = firstName[0];
    const mi = middleName ? middleName[0] : '';
    const li = lastName[0];
    
    const switches = document.querySelectorAll('#email .switch');
    const options = {};
    switches.forEach(sw => {
        options[sw.dataset.option] = sw.classList.contains('active');
    });
    
    const patterns = [
        `${f}${l}`,
        `${l}${f}`,
        `${fi}${l}`,
        `${f}${li}`,
        `${fi}${li}`,
        `${l}${fi}`,
        `${f}`,
        `${l}`
    ];
    
    if (m) {
        patterns.push(`${f}${m}${l}`, `${fi}${mi}${l}`, `${f}${mi}${l}`);
    }
    
    const separators = [''];
    if (options.dots) separators.push('.');
    if (options.underscores) separators.push('_');
    if (options.dashes) separators.push('-');
    
    patterns.forEach(pattern => {
        separators.forEach(sep => {
            let email = pattern;
            if (sep && pattern.length > 1) {
                if (pattern === `${f}${l}`) email = `${f}${sep}${l}`;
                else if (pattern === `${l}${f}`) email = `${l}${sep}${f}`;
                else if (pattern === `${fi}${l}`) email = `${fi}${sep}${l}`;
                else if (pattern === `${f}${li}`) email = `${f}${sep}${li}`;
            }
            generatedEmails.push(`${email}@${domain}`);
        });
    });
    
    if (options.numbers) {
        const baseEmails = [...generatedEmails];
        ['1', '01', '123'].forEach(num => {
            baseEmails.slice(0, 5).forEach(email => {
                const [local, dom] = email.split('@');
                generatedEmails.push(`${local}${num}@${dom}`);
            });
        });
    }
    
    generatedEmails = [...new Set(generatedEmails)];
    displayEmails();
    showToast(`Generated ${generatedEmails.length} email variations`, 'success');
}

function displayEmails() {
    const container = document.getElementById('emailOutput');
    container.innerHTML = generatedEmails.map(email => `
        <div class="hash-item">
            <span class="hash-value" style="margin: 0;">${email}</span>
            <button class="hash-copy" onclick="copyToClipboard('${email}')">Copy</button>
        </div>
    `).join('');
}

function copyAllEmails() {
    copyToClipboard(generatedEmails.join('\n'));
    showToast('All emails copied to clipboard', 'success');
}

function downloadEmails() {
    downloadFile(generatedEmails.join('\n'), 'emails.txt', 'text/plain');
}

// ==================== Subdomain Generator ====================
function generateSubdomains() {
    const domain = document.getElementById('subdomainDomain').value.trim();
    if (!domain) {
        showToast('Please enter a base domain', 'error');
        return;
    }
    
    const selectedCategories = Array.from(
        document.querySelectorAll('#subdomainCategories input[type="checkbox"]:checked')
    ).map(cb => cb.value);
    
    const customWords = document.getElementById('customSubdomains').value
        .split(',')
        .map(w => w.trim().toLowerCase())
        .filter(w => w);
    
    generatedSubdomains = [];
    
    selectedCategories.forEach(category => {
        if (subdomainWordlists[category]) {
            subdomainWordlists[category].forEach(word => {
                generatedSubdomains.push(`${word}.${domain}`);
            });
        }
    });
    
    customWords.forEach(word => {
        generatedSubdomains.push(`${word}.${domain}`);
    });
    
    generatedSubdomains = [...new Set(generatedSubdomains)].sort();
    
    document.getElementById('subdomainOutput').value = generatedSubdomains.join('\n');
    document.getElementById('subdomainCount').textContent = generatedSubdomains.length;
    showToast(`Generated ${generatedSubdomains.length} subdomains`, 'success');
}

function downloadSubdomains() {
    if (generatedSubdomains.length === 0) {
        showToast('No subdomains to download', 'error');
        return;
    }
    downloadFile(generatedSubdomains.join('\n'), 'subdomains.txt', 'text/plain');
}

// ==================== Metadata Viewer ====================
function initDragDrop() {
    const dropzone = document.getElementById('metadataDropzone');
    if (!dropzone) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
    });
    
    dropzone.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        extractMetadata(files[0]);
    }
}

function extractMetadata(file) {
    if (!file || !file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('metadataPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    extractedMetadata = {
        basic: {
            'File Name': file.name,
            'File Size': formatFileSize(file.size),
            'File Type': file.type,
            'Last Modified': new Date(file.lastModified).toLocaleString()
        },
        exif: {},
        gps: null
    };
    
    EXIF.getData(file, function() {
        const allTags = EXIF.getAllTags(this);
        
        const exifFields = ['Make', 'Model', 'DateTime', 'DateTimeOriginal', 'ExposureTime', 
            'FNumber', 'ISOSpeedRatings', 'FocalLength', 'Flash', 'Orientation',
            'XResolution', 'YResolution', 'Software', 'Artist', 'Copyright'];
        
        exifFields.forEach(field => {
            if (allTags[field]) {
                extractedMetadata.exif[field] = allTags[field];
            }
        });
        
        if (allTags.GPSLatitude && allTags.GPSLongitude) {
            const lat = convertDMSToDD(allTags.GPSLatitude, allTags.GPSLatitudeRef);
            const lng = convertDMSToDD(allTags.GPSLongitude, allTags.GPSLongitudeRef);
            extractedMetadata.gps = { lat, lng };
        }
        
        displayMetadataResults();
    });
}

function convertDMSToDD(dms, ref) {
    const degrees = dms[0] + dms[1] / 60 + dms[2] / 3600;
    return (ref === 'S' || ref === 'W') ? -degrees : degrees;
}

function displayMetadataResults() {
    const resultsDiv = document.getElementById('metadataResults');
    const accordionsDiv = document.getElementById('metadataAccordions');
    const mapDiv = document.getElementById('metadataMap');
    
    let html = '';
    
    html += createAccordion('Basic Info', extractedMetadata.basic, true);
    
    if (Object.keys(extractedMetadata.exif).length > 0) {
        html += createAccordion('EXIF Data', extractedMetadata.exif, true);
    }
    
    if (extractedMetadata.gps) {
        html += createAccordion('GPS Data', {
            'Latitude': extractedMetadata.gps.lat.toFixed(6),
            'Longitude': extractedMetadata.gps.lng.toFixed(6),
            'Google Maps': `<a href="https://maps.google.com/?q=${extractedMetadata.gps.lat},${extractedMetadata.gps.lng}" target="_blank">Open in Maps</a>`
        }, true);
        
        mapDiv.style.display = 'block';
        setTimeout(() => {
            if (metadataMap) {
                metadataMap.remove();
            }
            metadataMap = L.map('metadataMap').setView([extractedMetadata.gps.lat, extractedMetadata.gps.lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(metadataMap);
            L.marker([extractedMetadata.gps.lat, extractedMetadata.gps.lng]).addTo(metadataMap);
        }, 100);
    } else {
        mapDiv.style.display = 'none';
    }
    
    accordionsDiv.innerHTML = html;
    resultsDiv.style.display = 'grid';
    
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            this.nextElementSibling.classList.toggle('active');
        });
    });
    
    showToast('Metadata extracted successfully', 'success');
}

function createAccordion(title, data, open = false) {
    const rows = Object.entries(data).map(([key, value]) => `
        <div class="metadata-row">
            <span class="metadata-key">${key}</span>
            <span class="metadata-value">${value}</span>
        </div>
    `).join('');
    
    return `
        <div class="accordion">
            <button class="accordion-header ${open ? 'active' : ''}">
                ${title}
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="accordion-body ${open ? 'active' : ''}">
                ${rows}
            </div>
        </div>
    `;
}

// ==================== Hash Tools ====================
async function generateHashes() {
    const input = document.getElementById('hashInput').value;
    if (!input) {
        showToast('Please enter text to hash', 'error');
        return;
    }
    
    const hashes = [
        { type: 'MD5', value: md5(input) },
        { type: 'SHA-1', value: await sha1(input) },
        { type: 'SHA-256', value: await sha256(input) },
        { type: 'SHA-512', value: await sha512(input) },
        { type: 'Base64', value: btoa(unescape(encodeURIComponent(input))) }
    ];
    
    const container = document.getElementById('hashOutput');
    container.innerHTML = hashes.map(h => `
        <div class="hash-item">
            <span class="hash-type">${h.type}</span>
            <span class="hash-value">${h.value}</span>
            <button class="hash-copy" onclick="copyToClipboard('${h.value}')">Copy</button>
        </div>
    `).join('');
    container.style.display = 'block';
    
    showToast('Hashes generated', 'success');
}

function encodeDecodeText() {
    const input = document.getElementById('decodeInput').value;
    const operation = document.querySelector('input[name="encode"]:checked').value;
    
    if (!input) {
        showToast('Please enter text to transform', 'error');
        return;
    }
    
    let result = '';
    try {
        switch(operation) {
            case 'base64_encode':
                result = btoa(unescape(encodeURIComponent(input)));
                break;
            case 'base64_decode':
                result = decodeURIComponent(escape(atob(input)));
                break;
            case 'url_encode':
                result = encodeURIComponent(input);
                break;
            case 'url_decode':
                result = decodeURIComponent(input);
                break;
            case 'hex_encode':
                result = Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
                break;
            case 'hex_decode':
                result = input.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
                break;
        }
        document.getElementById('decodeOutput').value = result;
        showToast('Transformation complete', 'success');
    } catch (e) {
        showToast('Invalid input for this operation', 'error');
    }
}

// Hash functions
function md5(string) {
    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
    function md51(s) {
        var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
        for (i = 64; i <= s.length; i += 64) { md5cycle(state, md5blk(s.substring(i - 64, i))); }
        s = s.substring(i - 64); var tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) { md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0; }
        tail[14] = n * 8; md5cycle(state, tail); return state;
    }
    function md5blk(s) { var md5blks = [], i; for (i = 0; i < 64; i += 4) { md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24); } return md5blks; }
    var hex_chr = '0123456789abcdef'.split('');
    function rhex(n) { var s = '', j = 0; for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F]; return s; }
    function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
    function hex(x) { for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]); return x.join(''); }
    return hex(md51(string));
}

async function sha1(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha512(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-512', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ==================== IP Calculator ====================
function setIPExample(ip) {
    document.getElementById('ipInput').value = ip;
    calculateIP();
}

function calculateIP() {
    const input = document.getElementById('ipInput').value.trim();
    if (!input) {
        showToast('Please enter an IP address or CIDR', 'error');
        return;
    }
    
    let ip, cidr = 32;
    if (input.includes('/')) {
        [ip, cidr] = input.split('/');
        cidr = parseInt(cidr);
    } else {
        ip = input;
    }
    
    const ipParts = ip.split('.').map(Number);
    if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
        showToast('Invalid IP address format', 'error');
        return;
    }
    
    const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const network = (ipNum & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const firstHost = network + 1;
    const lastHost = broadcast - 1;
    const totalHosts = Math.pow(2, 32 - cidr) - 2;
    
    const numToIP = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
    const numToBinary = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].map(o => o.toString(2).padStart(8, '0')).join('.');
    
    const results = {
        'IP Address': ip,
        'CIDR': `/${cidr}`,
        'Subnet Mask': numToIP(mask),
        'Network Address': numToIP(network),
        'Broadcast Address': numToIP(broadcast),
        'First Host': numToIP(firstHost),
        'Last Host': numToIP(lastHost),
        'Total Hosts': totalHosts > 0 ? totalHosts.toLocaleString() : '0',
        'IP Class': getIPClass(ipParts[0]),
        'Binary Mask': numToBinary(mask)
    };
    
    const grid = document.getElementById('ipInfoGrid');
    grid.innerHTML = Object.entries(results).map(([label, value]) => `
        <div class="ip-info-card">
            <div class="ip-info-label">${label}</div>
            <div class="ip-info-value">${value}</div>
        </div>
    `).join('');
    
    document.getElementById('ipResults').style.display = 'block';
    showToast('IP calculated successfully', 'success');
}

function getIPClass(firstOctet) {
    if (firstOctet < 128) return 'Class A';
    if (firstOctet < 192) return 'Class B';
    if (firstOctet < 224) return 'Class C';
    if (firstOctet < 240) return 'Class D (Multicast)';
    return 'Class E (Reserved)';
}

// ==================== Regex Tester ====================
function useRegexTemplate(type) {
    const templates = {
        email: '[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}',
        ip: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}',
        url: 'https?://[\\w./\\-?=&]+',
        phone: '[\\d\\-()+ ]{10,}'
    };
    document.getElementById('regexPattern').value = templates[type] || '';
}

function testRegex() {
    const pattern = document.getElementById('regexPattern').value;
    const testString = document.getElementById('regexTest').value;
    
    if (!pattern || !testString) {
        showToast('Please enter both pattern and test string', 'error');
        return;
    }
    
    const flags = Array.from(
        document.querySelectorAll('#regexFlags input[type="checkbox"]:checked')
    ).map(cb => cb.value).join('');
    
    try {
        const regex = new RegExp(pattern, flags);
        const matches = testString.match(regex) || [];
        
        let highlighted = testString;
        if (matches.length > 0) {
            const uniqueMatches = [...new Set(matches)];
            uniqueMatches.forEach(match => {
                highlighted = highlighted.split(match).join(`<span class="regex-match">${match}</span>`);
            });
        }
        
        document.getElementById('regexOutput').innerHTML = highlighted;
        document.getElementById('regexMatchCount').textContent = matches.length;
        
        showToast(`Found ${matches.length} matches`, 'success');
    } catch (e) {
        showToast('Invalid regex pattern', 'error');
    }
}

// ==================== Report Builder ====================
function toggleReportSidebar() {
    document.getElementById('reportSidebar').classList.toggle('open');
}

function addToReport(type, content) {
    const item = {
        id: Date.now(),
        type: type,
        content: content,
        timestamp: new Date().toISOString()
    };
    
    reportData.push(item);
    updateReportUI();
    showToast('Added to report', 'success');
}

function updateReportUI() {
    const container = document.getElementById('reportItems');
    const badge = document.getElementById('reportBadge');
    const count = document.getElementById('reportItemCount');
    
    if (reportData.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 20px;">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 16px; display: block;"></i>
                <p>No items in report yet</p>
                <p style="font-size: 0.85rem;">Click the <i class="fas fa-plus"></i> button on any result to add it here</p>
            </div>
        `;
        badge.style.display = 'none';
    } else {
        container.innerHTML = reportData.map(item => `
            <div class="report-item" draggable="true" data-id="${item.id}">
                <div class="report-item-header">
                    <span class="report-item-type">${item.type}</span>
                    <button class="report-item-remove" onclick="removeFromReport(${item.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="report-item-content">${item.content}</div>
            </div>
        `).join('');
        badge.textContent = reportData.length;
        badge.style.display = 'flex';
    }
    
    count.textContent = reportData.length;
}

function removeFromReport(id) {
    reportData = reportData.filter(item => item.id !== id);
    updateReportUI();
}

function clearReport() {
    if (reportData.length === 0) return;
    if (confirm('Clear all items from report?')) {
        reportData = [];
        updateReportUI();
        showToast('Report cleared', 'success');
    }
}

function exportReport(format) {
    if (reportData.length === 0) {
        showToast('No items to export', 'error');
        return;
    }
    
    const report = {
        title: 'OSINT Report',
        generated: new Date().toISOString(),
        items: reportData
    };
    
    const content = JSON.stringify(report, null, 2);
    downloadFile(content, `osint-report-${Date.now()}.json`, 'application/json');
    showToast('Report exported', 'success');
}

// ==================== Utility Functions ====================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard', 'success');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard', 'success');
    });
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Input event listeners for live preview
document.addEventListener('DOMContentLoaded', function() {
    const dorkInputs = ['dorkTarget', 'dorkFileTypes', 'dorkKeywords'];
    dorkInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateLivePreview);
        }
    });
});
