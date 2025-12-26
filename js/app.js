// OSINT Suite - Advanced Open Source Intelligence Toolkit
// All client-side processing - no backend required

// ==================== Global State ====================
let reportData = [];
let generatedDorks = [];
let generatedEmails = [];
let generatedSubdomains = [];
let generatedUsernameLinks = [];
let extractedMetadata = {};
let generatedHashes = [];
let ipCalculationResults = {};
let regexMatches = [];

// ==================== Platform Database for Username OSINT ====================
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
        { name: 'PyPI', url: 'https://pypi.org/user/{username}', icon: 'fab fa-python' },
        { name: 'Docker Hub', url: 'https://hub.docker.com/u/{username}', icon: 'fab fa-docker' },
        { name: 'Gist', url: 'https://gist.github.com/{username}', icon: 'fab fa-github' }
    ],
    gaming: [
        { name: 'Steam', url: 'https://steamcommunity.com/id/{username}', icon: 'fab fa-steam' },
        { name: 'Xbox', url: 'https://xboxgamertag.com/search/{username}', icon: 'fab fa-xbox' },
        { name: 'PlayStation', url: 'https://psnprofiles.com/{username}', icon: 'fab fa-playstation' },
        { name: 'Twitch', url: 'https://twitch.tv/{username}', icon: 'fab fa-twitch' },
        { name: 'Discord', url: 'https://discord.com/users/{username}', icon: 'fab fa-discord' },
        { name: 'Epic Games', url: 'https://fortnitetracker.com/profile/all/{username}', icon: 'fas fa-gamepad' },
        { name: 'Roblox', url: 'https://roblox.com/users/profile?username={username}', icon: 'fas fa-cube' },
        { name: 'Minecraft', url: 'https://namemc.com/profile/{username}', icon: 'fas fa-cube' },
        { name: 'Chess.com', url: 'https://chess.com/member/{username}', icon: 'fas fa-chess' },
        { name: 'Lichess', url: 'https://lichess.org/@/{username}', icon: 'fas fa-chess-knight' }
    ],
    dating: [
        { name: 'OkCupid', url: 'https://okcupid.com/profile/{username}', icon: 'fas fa-heart' },
        { name: 'PlentyOfFish', url: 'https://pof.com/viewprofile.aspx?profile_id={username}', icon: 'fas fa-fish' }
    ],
    forums: [
        { name: 'Hacker News', url: 'https://news.ycombinator.com/user?id={username}', icon: 'fab fa-hacker-news' },
        { name: 'Product Hunt', url: 'https://producthunt.com/@{username}', icon: 'fab fa-product-hunt' },
        { name: 'Quora', url: 'https://quora.com/profile/{username}', icon: 'fab fa-quora' },
        { name: 'Medium', url: 'https://medium.com/@{username}', icon: 'fab fa-medium' },
        { name: 'Disqus', url: 'https://disqus.com/by/{username}', icon: 'fas fa-comments' },
        { name: 'Imgur', url: 'https://imgur.com/user/{username}', icon: 'fas fa-image' },
        { name: '9GAG', url: 'https://9gag.com/u/{username}', icon: 'fas fa-laugh' },
        { name: 'Slashdot', url: 'https://slashdot.org/~{username}', icon: 'fas fa-slash' }
    ],
    media: [
        { name: 'YouTube', url: 'https://youtube.com/@{username}', icon: 'fab fa-youtube' },
        { name: 'Vimeo', url: 'https://vimeo.com/{username}', icon: 'fab fa-vimeo' },
        { name: 'Dailymotion', url: 'https://dailymotion.com/{username}', icon: 'fas fa-play-circle' },
        { name: 'Flickr', url: 'https://flickr.com/people/{username}', icon: 'fab fa-flickr' },
        { name: '500px', url: 'https://500px.com/{username}', icon: 'fab fa-500px' },
        { name: 'DeviantArt', url: 'https://{username}.deviantart.com', icon: 'fab fa-deviantart' },
        { name: 'Behance', url: 'https://behance.net/{username}', icon: 'fab fa-behance' },
        { name: 'Dribbble', url: 'https://dribbble.com/{username}', icon: 'fab fa-dribbble' },
        { name: 'ArtStation', url: 'https://artstation.com/{username}', icon: 'fas fa-palette' },
        { name: 'Unsplash', url: 'https://unsplash.com/@{username}', icon: 'fas fa-camera' }
    ],
    finance: [
        { name: 'Patreon', url: 'https://patreon.com/{username}', icon: 'fab fa-patreon' },
        { name: 'Ko-fi', url: 'https://ko-fi.com/{username}', icon: 'fas fa-coffee' },
        { name: 'Buy Me a Coffee', url: 'https://buymeacoffee.com/{username}', icon: 'fas fa-mug-hot' },
        { name: 'PayPal.me', url: 'https://paypal.me/{username}', icon: 'fab fa-paypal' },
        { name: 'Venmo', url: 'https://venmo.com/{username}', icon: 'fas fa-dollar-sign' },
        { name: 'CashApp', url: 'https://cash.app/${username}', icon: 'fas fa-money-bill' }
    ],
    music: [
        { name: 'Spotify', url: 'https://open.spotify.com/user/{username}', icon: 'fab fa-spotify' },
        { name: 'SoundCloud', url: 'https://soundcloud.com/{username}', icon: 'fab fa-soundcloud' },
        { name: 'Bandcamp', url: 'https://{username}.bandcamp.com', icon: 'fab fa-bandcamp' },
        { name: 'Last.fm', url: 'https://last.fm/user/{username}', icon: 'fab fa-lastfm' },
        { name: 'Mixcloud', url: 'https://mixcloud.com/{username}', icon: 'fab fa-mixcloud' },
        { name: 'Apple Music', url: 'https://music.apple.com/profile/{username}', icon: 'fab fa-apple' }
    ],
    other: [
        { name: 'Linktree', url: 'https://linktr.ee/{username}', icon: 'fas fa-tree' },
        { name: 'Carrd', url: 'https://{username}.carrd.co', icon: 'fas fa-id-card' },
        { name: 'Notion', url: 'https://notion.so/@{username}', icon: 'fas fa-sticky-note' },
        { name: 'Substack', url: 'https://{username}.substack.com', icon: 'fas fa-newspaper' },
        { name: 'Gumroad', url: 'https://gumroad.com/{username}', icon: 'fas fa-shopping-cart' },
        { name: 'Etsy', url: 'https://etsy.com/shop/{username}', icon: 'fab fa-etsy' },
        { name: 'eBay', url: 'https://ebay.com/usr/{username}', icon: 'fab fa-ebay' },
        { name: 'Telegram', url: 'https://t.me/{username}', icon: 'fab fa-telegram' },
        { name: 'WhatsApp', url: 'https://wa.me/{username}', icon: 'fab fa-whatsapp' },
        { name: 'Skype', url: 'https://join.skype.com/invite/{username}', icon: 'fab fa-skype' },
        { name: 'Slack', url: 'https://{username}.slack.com', icon: 'fab fa-slack' },
        { name: 'Trello', url: 'https://trello.com/{username}', icon: 'fab fa-trello' },
        { name: 'Goodreads', url: 'https://goodreads.com/{username}', icon: 'fab fa-goodreads' },
        { name: 'Letterboxd', url: 'https://letterboxd.com/{username}', icon: 'fas fa-film' },
        { name: 'MyAnimeList', url: 'https://myanimelist.net/profile/{username}', icon: 'fas fa-tv' },
        { name: 'Anilist', url: 'https://anilist.co/user/{username}', icon: 'fas fa-play' },
        { name: 'Wattpad', url: 'https://wattpad.com/user/{username}', icon: 'fab fa-wattpad' },
        { name: 'Archive.org', url: 'https://archive.org/details/@{username}', icon: 'fas fa-archive' }
    ]
};

// ==================== Subdomain Wordlists ====================
const subdomainWordlists = {
    common: ['www', 'mail', 'ftp', 'localhost', 'webmail', 'smtp', 'pop', 'ns1', 'ns2', 'ns3', 'ns4', 'dns', 'dns1', 'dns2', 'mx', 'mx1', 'mx2', 'email', 'remote', 'blog', 'server', 'ns', 'www1', 'www2', 'www3', 'secure', 'vpn', 'shop', 'store', 'web', 'support', 'home', 'news', 'portal', 'host', 'cloud'],
    dev: ['dev', 'development', 'staging', 'stage', 'test', 'testing', 'qa', 'uat', 'sandbox', 'demo', 'preview', 'beta', 'alpha', 'canary', 'nightly', 'release', 'rc', 'preprod', 'pre-prod', 'integration', 'ci', 'cd', 'build', 'jenkins', 'gitlab', 'github', 'bitbucket', 'git', 'svn', 'repo', 'repository'],
    api: ['api', 'api1', 'api2', 'api3', 'apis', 'rest', 'graphql', 'gql', 'gateway', 'proxy', 'backend', 'service', 'services', 'microservice', 'microservices', 'ws', 'websocket', 'socket', 'rpc', 'grpc', 'oauth', 'auth', 'sso', 'identity', 'login', 'signin', 'signup', 'register', 'account', 'accounts'],
    admin: ['admin', 'administrator', 'panel', 'dashboard', 'manage', 'manager', 'management', 'console', 'control', 'controlpanel', 'cp', 'cpanel', 'webadmin', 'sysadmin', 'root', 'superuser', 'master', 'backend', 'backoffice', 'internal', 'staff', 'employee', 'hr', 'finance', 'billing', 'invoice'],
    mail: ['mail', 'email', 'smtp', 'pop', 'pop3', 'imap', 'mx', 'mx1', 'mx2', 'mx3', 'mailserver', 'mailhost', 'webmail', 'postfix', 'exchange', 'outlook', 'owa', 'autodiscover', 'autoconfig', 'spam', 'antispam', 'newsletter', 'mailer', 'mta', 'relay'],
    cloud: ['aws', 'azure', 'gcp', 'cloud', 'cdn', 's3', 'storage', 'bucket', 'blob', 'static', 'assets', 'media', 'images', 'img', 'files', 'download', 'downloads', 'upload', 'uploads', 'backup', 'backups', 'archive', 'lambda', 'function', 'functions', 'serverless', 'container', 'containers', 'docker', 'k8s', 'kubernetes', 'ecs', 'eks', 'aks', 'gke'],
    internal: ['vpn', 'intranet', 'internal', 'private', 'corp', 'corporate', 'office', 'lan', 'local', 'localhost', 'dev-internal', 'staging-internal', 'tools', 'wiki', 'confluence', 'jira', 'slack', 'teams', 'chat', 'meet', 'zoom', 'calendar', 'drive', 'docs', 'sharepoint'],
    database: ['db', 'database', 'mysql', 'postgres', 'postgresql', 'pgsql', 'mongo', 'mongodb', 'redis', 'memcached', 'elastic', 'elasticsearch', 'es', 'kibana', 'logstash', 'cassandra', 'couchdb', 'dynamodb', 'rds', 'sql', 'sqlserver', 'mssql', 'oracle', 'mariadb', 'phpmyadmin', 'adminer', 'pgadmin'],
    monitoring: ['grafana', 'kibana', 'prometheus', 'nagios', 'zabbix', 'datadog', 'newrelic', 'splunk', 'elk', 'logs', 'logging', 'log', 'metrics', 'monitor', 'monitoring', 'status', 'health', 'healthcheck', 'uptime', 'apm', 'trace', 'tracing', 'sentry', 'bugsnag', 'rollbar', 'alerts', 'pagerduty', 'opsgenie'],
    geo: ['us', 'eu', 'asia', 'uk', 'de', 'fr', 'jp', 'cn', 'au', 'ca', 'br', 'in', 'sg', 'hk', 'kr', 'us-east', 'us-west', 'eu-west', 'eu-central', 'ap-south', 'ap-northeast', 'ap-southeast', 'sa-east', 'na', 'emea', 'apac', 'latam', 'amer', 'global', 'worldwide', 'international']
};

// ==================== Dork Templates ====================
const dorkTemplates = {
    google: {
        files: ['site:{target} filetype:pdf', 'site:{target} filetype:doc', 'site:{target} filetype:docx', 'site:{target} filetype:xls', 'site:{target} filetype:xlsx', 'site:{target} filetype:ppt', 'site:{target} filetype:pptx', 'site:{target} filetype:txt', 'site:{target} filetype:rtf', 'site:{target} filetype:odt'],
        directories: ['site:{target} intitle:"index of"', 'site:{target} intitle:"directory listing"', 'site:{target} intitle:"parent directory"', 'site:{target} inurl:/listing/', 'site:{target} "directory listing for"'],
        login: ['site:{target} inurl:login', 'site:{target} inurl:signin', 'site:{target} inurl:admin', 'site:{target} inurl:dashboard', 'site:{target} intitle:login', 'site:{target} intitle:"admin panel"', 'site:{target} inurl:auth', 'site:{target} inurl:authenticate'],
        config: ['site:{target} filetype:env', 'site:{target} filetype:cfg', 'site:{target} filetype:conf', 'site:{target} filetype:ini', 'site:{target} filetype:yml', 'site:{target} filetype:yaml', 'site:{target} filetype:json', 'site:{target} filetype:xml', 'site:{target} inurl:config', 'site:{target} inurl:settings'],
        database: ['site:{target} filetype:sql', 'site:{target} filetype:db', 'site:{target} filetype:mdb', 'site:{target} filetype:sqlite', 'site:{target} filetype:dump', 'site:{target} inurl:phpmyadmin', 'site:{target} intitle:phpMyAdmin', 'site:{target} inurl:adminer'],
        backup: ['site:{target} filetype:bak', 'site:{target} filetype:backup', 'site:{target} filetype:old', 'site:{target} filetype:zip', 'site:{target} filetype:tar', 'site:{target} filetype:gz', 'site:{target} filetype:rar', 'site:{target} inurl:backup', 'site:{target} intitle:backup'],
        errors: ['site:{target} "error" "warning"', 'site:{target} "fatal error"', 'site:{target} "mysql error"', 'site:{target} "sql syntax"', 'site:{target} "stack trace"', 'site:{target} "exception"', 'site:{target} inurl:debug', 'site:{target} "undefined index"'],
        sensitive: ['site:{target} filetype:log', 'site:{target} filetype:env', 'site:{target} "password"', 'site:{target} "api_key"', 'site:{target} "apikey"', 'site:{target} "secret"', 'site:{target} "token"', 'site:{target} "private"', 'site:{target} "credential"', 'site:{target} inurl:.git'],
        api: ['site:{target} inurl:api', 'site:{target} inurl:/api/v1', 'site:{target} inurl:/api/v2', 'site:{target} inurl:graphql', 'site:{target} inurl:rest', 'site:{target} inurl:swagger', 'site:{target} inurl:openapi', 'site:{target} filetype:wadl', 'site:{target} filetype:wsdl'],
        admin: ['site:{target} inurl:admin', 'site:{target} inurl:administrator', 'site:{target} inurl:panel', 'site:{target} inurl:dashboard', 'site:{target} inurl:manage', 'site:{target} inurl:control', 'site:{target} inurl:cpanel', 'site:{target} intitle:admin', 'site:{target} intitle:dashboard']
    },
    github: {
        files: ['"{target}" filename:.env', '"{target}" filename:config', '"{target}" filename:settings', '"{target}" filename:credentials', '"{target}" filename:secrets'],
        sensitive: ['"{target}" password', '"{target}" api_key', '"{target}" apikey', '"{target}" secret', '"{target}" token', '"{target}" private_key', '"{target}" aws_access_key', '"{target}" aws_secret'],
        config: ['"{target}" filename:.env', '"{target}" filename:config.json', '"{target}" filename:config.yml', '"{target}" filename:settings.py', '"{target}" filename:application.properties'],
        database: ['"{target}" filename:database.yml', '"{target}" filename:db.json', '"{target}" connection_string', '"{target}" mongodb://', '"{target}" mysql://'],
        api: ['"{target}" filename:swagger.json', '"{target}" filename:openapi.yaml', '"{target}" api_endpoint', '"{target}" base_url'],
        admin: ['"{target}" admin_password', '"{target}" admin_user', '"{target}" root_password'],
        backup: ['"{target}" filename:backup', '"{target}" filename:.bak'],
        errors: ['"{target}" stack_trace', '"{target}" error_log'],
        directories: ['"{target}" path:/', '"{target}" filename:index'],
        login: ['"{target}" login_url', '"{target}" auth_url']
    },
    shodan: {
        files: ['hostname:{target}', 'ssl.cert.subject.cn:{target}'],
        directories: ['http.title:"Index of" hostname:{target}'],
        login: ['http.title:login hostname:{target}', 'http.title:admin hostname:{target}'],
        config: ['hostname:{target} port:22', 'hostname:{target} port:21'],
        database: ['hostname:{target} port:3306', 'hostname:{target} port:5432', 'hostname:{target} port:27017', 'hostname:{target} port:6379'],
        sensitive: ['hostname:{target} "password"', 'hostname:{target} has_screenshot:true'],
        api: ['hostname:{target} port:8080', 'hostname:{target} port:443'],
        admin: ['hostname:{target} http.title:dashboard', 'hostname:{target} http.title:panel'],
        backup: ['hostname:{target} port:873'],
        errors: ['hostname:{target} http.status:500']
    },
    bing: {
        files: ['site:{target} filetype:pdf', 'site:{target} filetype:doc', 'site:{target} filetype:xls'],
        directories: ['site:{target} intitle:"index of"'],
        login: ['site:{target} inurl:login', 'site:{target} inurl:admin'],
        config: ['site:{target} filetype:env', 'site:{target} filetype:cfg'],
        database: ['site:{target} filetype:sql', 'site:{target} filetype:db'],
        backup: ['site:{target} filetype:bak', 'site:{target} filetype:backup'],
        errors: ['site:{target} "error"', 'site:{target} "warning"'],
        sensitive: ['site:{target} "password"', 'site:{target} "api_key"'],
        api: ['site:{target} inurl:api'],
        admin: ['site:{target} inurl:admin', 'site:{target} inurl:dashboard']
    },
    duckduckgo: {
        files: ['site:{target} filetype:pdf', 'site:{target} filetype:doc'],
        directories: ['site:{target} intitle:"index of"'],
        login: ['site:{target} inurl:login'],
        config: ['site:{target} filetype:env'],
        database: ['site:{target} filetype:sql'],
        backup: ['site:{target} filetype:bak'],
        errors: ['site:{target} "error"'],
        sensitive: ['site:{target} "password"'],
        api: ['site:{target} inurl:api'],
        admin: ['site:{target} inurl:admin']
    }
};

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCheckboxes();
    initRadioButtons();
    initDragDrop();
    loadReportFromStorage();
    updateReportCount();
});

// ==================== Navigation ====================
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const moduleId = this.dataset.module;
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
            document.getElementById(moduleId).classList.add('active');
        });
    });
}

// ==================== Checkbox/Radio Initialization ====================
function initCheckboxes() {
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('selected');
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = this.classList.contains('selected');
        });
    });
}

function initRadioButtons() {
    document.querySelectorAll('.radio-group').forEach(group => {
        group.querySelectorAll('.radio-item').forEach(item => {
            item.addEventListener('click', function() {
                group.querySelectorAll('.radio-item').forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                const radio = this.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });
    });
}

// ==================== Drag & Drop for Metadata ====================
function initDragDrop() {
    const uploadArea = document.getElementById('metadataUpload');
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.style.borderColor = 'var(--teal)', false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.style.borderColor = 'var(--gray)', false);
        });
        uploadArea.addEventListener('drop', handleDrop, false);
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        document.getElementById('metadataFile').files = files;
        extractMetadata(document.getElementById('metadataFile'));
    }
}

// ==================== Module 1: Dork Generator ====================
function generateDorks() {
    const target = document.getElementById('dorkTarget').value.trim();
    if (!target) {
        showToast('Please enter a target domain or keyword');
        return;
    }

    const engine = document.querySelector('input[name="engine"]:checked').value;
    const selectedCategories = Array.from(document.querySelectorAll('#dorkCategories .checkbox-item.selected input')).map(i => i.value);
    const fileTypes = document.getElementById('dorkFileTypes').value.split(',').map(t => t.trim()).filter(t => t);

    generatedDorks = [];
    const templates = dorkTemplates[engine] || dorkTemplates.google;

    selectedCategories.forEach(category => {
        if (templates[category]) {
            templates[category].forEach(template => {
                generatedDorks.push(template.replace(/{target}/g, target));
            });
        }
    });

    // Add file type dorks
    if (fileTypes.length > 0 && engine !== 'shodan') {
        fileTypes.forEach(ft => {
            if (engine === 'github') {
                generatedDorks.push(`"${target}" filename:.${ft}`);
            } else {
                generatedDorks.push(`site:${target} filetype:${ft}`);
            }
        });
    }

    displayDorks(engine);
}

function displayDorks(engine) {
    const container = document.getElementById('dorkList');
    const resultsContainer = document.getElementById('dorkResults');
    
    if (generatedDorks.length === 0) {
        resultsContainer.style.display = 'none';
        showToast('No dorks generated. Select at least one category.');
        return;
    }

    const searchUrls = {
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        duckduckgo: 'https://duckduckgo.com/?q=',
        github: 'https://github.com/search?q=',
        shodan: 'https://www.shodan.io/search?query='
    };

    container.innerHTML = generatedDorks.map(dork => `
        <div class="result-item">
            <code style="flex: 1;">${escapeHtml(dork)}</code>
            <div class="btn-group" style="margin: 0;">
                <button class="btn btn-outline" onclick="copyToClipboard('${escapeHtml(dork)}')"><i class="fas fa-copy"></i></button>
                <a href="${searchUrls[engine]}${encodeURIComponent(dork)}" target="_blank" class="btn btn-primary"><i class="fas fa-search"></i></a>
            </div>
        </div>
    `).join('');

    document.getElementById('dorkCount').textContent = generatedDorks.length;
    resultsContainer.style.display = 'block';
    showToast(`Generated ${generatedDorks.length} dorks`);
}

function useDorkTemplate(type) {
    const target = document.getElementById('dorkTarget').value.trim() || 'example.com';
    const templates = {
        sensitive: `site:${target} filetype:env | filetype:sql | filetype:log`,
        admin: `site:${target} inurl:admin | inurl:login | inurl:dashboard`,
        exposed: `site:${target} intitle:"index of"`,
        github: `"${target}" password | api_key | secret filename:.env`,
        cloud: `site:s3.amazonaws.com "${target}"`,
        cameras: `inurl:/view.shtml | inurl:ViewerFrame`,
        wordpress: `site:${target} inurl:wp-content | inurl:wp-admin`
    };
    
    generatedDorks = [templates[type]];
    document.getElementById('dorkList').innerHTML = `
        <div class="result-item">
            <code style="flex: 1;">${escapeHtml(templates[type])}</code>
            <div class="btn-group" style="margin: 0;">
                <button class="btn btn-outline" onclick="copyToClipboard('${escapeHtml(templates[type])}')"><i class="fas fa-copy"></i></button>
                <a href="https://www.google.com/search?q=${encodeURIComponent(templates[type])}" target="_blank" class="btn btn-primary"><i class="fas fa-search"></i></a>
            </div>
        </div>
    `;
    document.getElementById('dorkCount').textContent = 1;
    document.getElementById('dorkResults').style.display = 'block';
}

function clearDorks() {
    document.getElementById('dorkTarget').value = '';
    document.getElementById('dorkFileTypes').value = '';
    document.getElementById('dorkResults').style.display = 'none';
    generatedDorks = [];
}

function copyAllDorks() {
    copyToClipboard(generatedDorks.join('\n'));
    showToast('All dorks copied to clipboard');
}

function addDorksToReport() {
    if (generatedDorks.length === 0) return;
    addToReport('Dork Generator', generatedDorks, 'Generated search dorks');
}

// ==================== Module 2: Username OSINT ====================
function searchUsername() {
    const username = document.getElementById('usernameInput').value.trim();
    if (!username) {
        showToast('Please enter a username');
        return;
    }

    const selectedCategories = Array.from(document.querySelectorAll('#platformCategories .checkbox-item.selected input')).map(i => i.value);
    generatedUsernameLinks = [];

    selectedCategories.forEach(category => {
        if (platforms[category]) {
            platforms[category].forEach(platform => {
                generatedUsernameLinks.push({
                    name: platform.name,
                    url: platform.url.replace(/{username}/g, username),
                    icon: platform.icon,
                    category: category
                });
            });
        }
    });

    displayUsernameLinks();
}

function displayUsernameLinks() {
    const container = document.getElementById('platformLinks');
    const resultsContainer = document.getElementById('usernameResults');
    const statsContainer = document.getElementById('usernameStats');

    if (generatedUsernameLinks.length === 0) {
        resultsContainer.style.display = 'none';
        statsContainer.style.display = 'none';
        showToast('No platforms selected');
        return;
    }

    // Group by category
    const grouped = {};
    generatedUsernameLinks.forEach(link => {
        if (!grouped[link.category]) grouped[link.category] = [];
        grouped[link.category].push(link);
    });

    container.innerHTML = Object.entries(grouped).map(([category, links]) => `
        <div class="platform-category">
            <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
            ${links.map(link => `
                <div class="result-item">
                    <span><i class="${link.icon}"></i> ${link.name}</span>
                    <a href="${link.url}" target="_blank" class="btn btn-outline"><i class="fas fa-external-link-alt"></i> Open</a>
                </div>
            `).join('')}
        </div>
    `).join('');

    document.getElementById('totalPlatforms').textContent = Object.keys(grouped).length;
    document.getElementById('linksGenerated').textContent = generatedUsernameLinks.length;
    statsContainer.style.display = 'flex';
    resultsContainer.style.display = 'block';
    showToast(`Generated ${generatedUsernameLinks.length} platform links`);
}

function openAllUsernameLinks() {
    if (generatedUsernameLinks.length === 0) {
        searchUsername();
    }
    if (generatedUsernameLinks.length > 20) {
        if (!confirm(`This will open ${generatedUsernameLinks.length} tabs. Continue?`)) return;
    }
    generatedUsernameLinks.forEach(link => window.open(link.url, '_blank'));
}

function selectAllPlatforms() {
    document.querySelectorAll('#platformCategories .checkbox-item').forEach(item => {
        item.classList.add('selected');
        const checkbox = item.querySelector('input');
        if (checkbox) checkbox.checked = true;
    });
}

function addUsernameToReport() {
    if (generatedUsernameLinks.length === 0) return;
    const username = document.getElementById('usernameInput').value.trim();
    addToReport('Username OSINT', generatedUsernameLinks.map(l => `${l.name}: ${l.url}`), `Username search for: ${username}`);
}

// ==================== Module 3: Email Permutator ====================
function generateEmails() {
    const firstName = document.getElementById('emailFirstName').value.trim().toLowerCase();
    const lastName = document.getElementById('emailLastName').value.trim().toLowerCase();
    const middleName = document.getElementById('emailMiddleName').value.trim().toLowerCase();
    const domainsText = document.getElementById('emailDomains').value.trim();

    if (!firstName || !lastName || !domainsText) {
        showToast('Please fill in first name, last name, and at least one domain');
        return;
    }

    const domains = domainsText.split(/[\n,]/).map(d => d.trim()).filter(d => d);
    const separators = Array.from(document.querySelectorAll('#emailSeparators .checkbox-item.selected input')).map(i => i.value);
    const variations = Array.from(document.querySelectorAll('#emailVariations .checkbox-item.selected input')).map(i => i.value);

    generatedEmails = [];
    const f = firstName;
    const l = lastName;
    const m = middleName;
    const fi = firstName.charAt(0);
    const li = lastName.charAt(0);
    const mi = middleName ? middleName.charAt(0) : '';

    domains.forEach(domain => {
        separators.forEach(sep => {
            if (variations.includes('standard')) {
                generatedEmails.push(`${f}${sep}${l}@${domain}`);
                generatedEmails.push(`${f}@${domain}`);
                generatedEmails.push(`${l}@${domain}`);
                if (m) generatedEmails.push(`${f}${sep}${m}${sep}${l}@${domain}`);
            }
            if (variations.includes('reverse')) {
                generatedEmails.push(`${l}${sep}${f}@${domain}`);
                if (m) generatedEmails.push(`${l}${sep}${m}${sep}${f}@${domain}`);
            }
            if (variations.includes('initials')) {
                generatedEmails.push(`${fi}${l}@${domain}`);
                generatedEmails.push(`${fi}${sep}${l}@${domain}`);
                generatedEmails.push(`${f}${li}@${domain}`);
                generatedEmails.push(`${f}${sep}${li}@${domain}`);
                generatedEmails.push(`${fi}${li}@${domain}`);
                if (m) {
                    generatedEmails.push(`${fi}${mi}${l}@${domain}`);
                    generatedEmails.push(`${fi}${sep}${mi}${sep}${l}@${domain}`);
                }
            }
        });

        if (variations.includes('numbers')) {
            for (let i = 1; i <= 99; i++) {
                generatedEmails.push(`${f}${l}${i}@${domain}`);
                generatedEmails.push(`${f}.${l}${i}@${domain}`);
            }
        }

        if (variations.includes('year')) {
            for (let year = 2020; year <= 2025; year++) {
                generatedEmails.push(`${f}${l}${year}@${domain}`);
                generatedEmails.push(`${f}.${l}${year}@${domain}`);
            }
        }
    });

    // Remove duplicates
    generatedEmails = [...new Set(generatedEmails)];
    displayEmails();
}

function displayEmails() {
    const container = document.getElementById('emailList');
    const resultsContainer = document.getElementById('emailResults');

    if (generatedEmails.length === 0) {
        resultsContainer.style.display = 'none';
        return;
    }

    container.textContent = generatedEmails.join('\n');
    document.getElementById('emailCount').textContent = generatedEmails.length;
    resultsContainer.style.display = 'block';
    showToast(`Generated ${generatedEmails.length} email permutations`);
}

function clearEmails() {
    document.getElementById('emailFirstName').value = '';
    document.getElementById('emailLastName').value = '';
    document.getElementById('emailMiddleName').value = '';
    document.getElementById('emailDomains').value = '';
    document.getElementById('emailResults').style.display = 'none';
    generatedEmails = [];
}

function copyAllEmails() {
    copyToClipboard(generatedEmails.join('\n'));
    showToast('All emails copied to clipboard');
}

function downloadEmails() {
    downloadFile(generatedEmails.join('\n'), 'emails.txt', 'text/plain');
}

function addEmailsToReport() {
    if (generatedEmails.length === 0) return;
    const firstName = document.getElementById('emailFirstName').value.trim();
    const lastName = document.getElementById('emailLastName').value.trim();
    addToReport('Email Permutator', generatedEmails, `Email permutations for: ${firstName} ${lastName}`);
}

// ==================== Module 4: Subdomain Generator ====================
function generateSubdomains() {
    const target = document.getElementById('subdomainTarget').value.trim();
    if (!target) {
        showToast('Please enter a target domain');
        return;
    }

    const selectedCategories = Array.from(document.querySelectorAll('#subdomainCategories .checkbox-item.selected input')).map(i => i.value);
    const customWords = document.getElementById('customSubdomains').value.split('\n').map(w => w.trim()).filter(w => w);
    const addNumbers = document.getElementById('subdomainNumbers').checked;
    const addEnv = document.getElementById('subdomainEnv').checked;

    generatedSubdomains = [];

    // Add words from selected categories
    selectedCategories.forEach(category => {
        if (subdomainWordlists[category]) {
            subdomainWordlists[category].forEach(word => {
                generatedSubdomains.push(`${word}.${target}`);
            });
        }
    });

    // Add custom words
    customWords.forEach(word => {
        generatedSubdomains.push(`${word}.${target}`);
    });

    // Add numbered variants
    if (addNumbers) {
        const baseWords = [...generatedSubdomains];
        baseWords.forEach(sub => {
            const word = sub.split('.')[0];
            for (let i = 1; i <= 5; i++) {
                generatedSubdomains.push(`${word}${i}.${target}`);
            }
        });
    }

    // Add environment suffixes
    if (addEnv) {
        const envSuffixes = ['-dev', '-prod', '-staging', '-test', '-qa', '-uat'];
        const baseWords = [...new Set(generatedSubdomains.map(s => s.split('.')[0]))];
        baseWords.forEach(word => {
            envSuffixes.forEach(suffix => {
                generatedSubdomains.push(`${word}${suffix}.${target}`);
            });
        });
    }

    // Remove duplicates and sort
    generatedSubdomains = [...new Set(generatedSubdomains)].sort();
    displaySubdomains();
}

function displaySubdomains() {
    const container = document.getElementById('subdomainList');
    const resultsContainer = document.getElementById('subdomainResults');

    if (generatedSubdomains.length === 0) {
        resultsContainer.style.display = 'none';
        return;
    }

    container.textContent = generatedSubdomains.join('\n');
    document.getElementById('subdomainCount').textContent = generatedSubdomains.length;
    resultsContainer.style.display = 'block';
    showToast(`Generated ${generatedSubdomains.length} subdomains`);
}

function clearSubdomains() {
    document.getElementById('subdomainTarget').value = '';
    document.getElementById('customSubdomains').value = '';
    document.getElementById('subdomainResults').style.display = 'none';
    generatedSubdomains = [];
}

function copyAllSubdomains() {
    copyToClipboard(generatedSubdomains.join('\n'));
    showToast('All subdomains copied to clipboard');
}

function downloadSubdomains() {
    downloadFile(generatedSubdomains.join('\n'), 'subdomains.txt', 'text/plain');
}

function addSubdomainsToReport() {
    if (generatedSubdomains.length === 0) return;
    const target = document.getElementById('subdomainTarget').value.trim();
    addToReport('Subdomain Wordlist', generatedSubdomains, `Subdomain wordlist for: ${target}`);
}

// ==================== Module 5: Metadata Viewer ====================
function extractMetadata(input) {
    const file = input.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('imagePreview').src = e.target.result;
        document.getElementById('imagePreviewContainer').style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Extract EXIF data
    extractedMetadata = {
        'File Name': file.name,
        'File Size': formatFileSize(file.size),
        'File Type': file.type,
        'Last Modified': new Date(file.lastModified).toLocaleString()
    };

    if (typeof EXIF !== 'undefined') {
        EXIF.getData(file, function() {
            const allMetaData = EXIF.getAllTags(this);
            
            // Add EXIF data
            const exifFields = ['Make', 'Model', 'DateTime', 'DateTimeOriginal', 'ExposureTime', 'FNumber', 'ISOSpeedRatings', 'FocalLength', 'Flash', 'Orientation', 'XResolution', 'YResolution', 'Software', 'Artist', 'Copyright', 'GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'ImageWidth', 'ImageHeight', 'ColorSpace', 'WhiteBalance', 'ExposureMode', 'MeteringMode'];
            
            exifFields.forEach(field => {
                if (allMetaData[field] !== undefined) {
                    extractedMetadata[field] = allMetaData[field];
                }
            });

            // Handle GPS coordinates
            if (allMetaData.GPSLatitude && allMetaData.GPSLongitude) {
                const lat = convertDMSToDD(allMetaData.GPSLatitude, allMetaData.GPSLatitudeRef);
                const lng = convertDMSToDD(allMetaData.GPSLongitude, allMetaData.GPSLongitudeRef);
                extractedMetadata['GPS Coordinates'] = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                extractedMetadata['Google Maps'] = `https://maps.google.com/?q=${lat},${lng}`;
            }

            displayMetadata();
        });
    } else {
        displayMetadata();
    }
}

function convertDMSToDD(dms, ref) {
    if (!dms || dms.length < 3) return 0;
    let dd = dms[0] + dms[1]/60 + dms[2]/3600;
    if (ref === 'S' || ref === 'W') dd = -dd;
    return dd;
}

function displayMetadata() {
    const tbody = document.getElementById('metadataBody');
    const resultsContainer = document.getElementById('metadataResults');

    tbody.innerHTML = Object.entries(extractedMetadata).map(([key, value]) => {
        let displayValue = value;
        if (key === 'Google Maps') {
            displayValue = `<a href="${value}" target="_blank">${value}</a>`;
        }
        return `<tr><td><strong>${key}</strong></td><td>${displayValue}</td></tr>`;
    }).join('');

    resultsContainer.style.display = 'block';
    showToast('Metadata extracted successfully');
}

function copyMetadata() {
    const text = Object.entries(extractedMetadata).map(([k, v]) => `${k}: ${v}`).join('\n');
    copyToClipboard(text);
    showToast('Metadata copied to clipboard');
}

function addMetadataToReport() {
    if (Object.keys(extractedMetadata).length === 0) return;
    addToReport('Metadata Extraction', Object.entries(extractedMetadata).map(([k, v]) => `${k}: ${v}`), `Extracted from: ${extractedMetadata['File Name']}`);
}

// ==================== Module 6: Hash Generator ====================
async function generateHashes() {
    const input = document.getElementById('hashInput').value;
    if (!input) {
        showToast('Please enter text to hash');
        return;
    }

    const selectedOps = Array.from(document.querySelectorAll('#hashOperations .checkbox-item.selected input')).map(i => i.value);
    generatedHashes = [];

    for (const op of selectedOps) {
        let result;
        switch (op) {
            case 'md5':
                result = { name: 'MD5', value: await md5(input) };
                break;
            case 'sha1':
                result = { name: 'SHA-1', value: await sha1(input) };
                break;
            case 'sha256':
                result = { name: 'SHA-256', value: await sha256(input) };
                break;
            case 'sha512':
                result = { name: 'SHA-512', value: await sha512(input) };
                break;
            case 'base64':
                result = { name: 'Base64 Encode', value: btoa(unescape(encodeURIComponent(input))) };
                break;
            case 'url':
                result = { name: 'URL Encode', value: encodeURIComponent(input) };
                break;
            case 'hex':
                result = { name: 'Hex Encode', value: stringToHex(input) };
                break;
            case 'binary':
                result = { name: 'Binary', value: stringToBinary(input) };
                break;
            case 'rot13':
                result = { name: 'ROT13', value: rot13(input) };
                break;
            case 'html':
                result = { name: 'HTML Entities', value: htmlEncode(input) };
                break;
        }
        if (result) generatedHashes.push(result);
    }

    displayHashes();
}

async function decodeHashes() {
    const input = document.getElementById('hashInput').value;
    if (!input) {
        showToast('Please enter text to decode');
        return;
    }

    generatedHashes = [];

    // Try Base64 decode
    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        generatedHashes.push({ name: 'Base64 Decode', value: decoded });
    } catch (e) {
        generatedHashes.push({ name: 'Base64 Decode', value: 'Invalid Base64' });
    }

    // URL decode
    try {
        generatedHashes.push({ name: 'URL Decode', value: decodeURIComponent(input) });
    } catch (e) {
        generatedHashes.push({ name: 'URL Decode', value: 'Invalid URL encoding' });
    }

    // Hex decode
    try {
        generatedHashes.push({ name: 'Hex Decode', value: hexToString(input) });
    } catch (e) {
        generatedHashes.push({ name: 'Hex Decode', value: 'Invalid Hex' });
    }

    // Binary decode
    try {
        generatedHashes.push({ name: 'Binary Decode', value: binaryToString(input) });
    } catch (e) {
        generatedHashes.push({ name: 'Binary Decode', value: 'Invalid Binary' });
    }

    // ROT13
    generatedHashes.push({ name: 'ROT13', value: rot13(input) });

    // HTML decode
    generatedHashes.push({ name: 'HTML Decode', value: htmlDecode(input) });

    displayHashes();
}

function displayHashes() {
    const container = document.getElementById('hashList');
    const resultsContainer = document.getElementById('hashResults');

    container.innerHTML = generatedHashes.map(hash => `
        <div class="hash-result-item">
            <h5>${hash.name}</h5>
            <code>${escapeHtml(hash.value)}</code>
            <button class="btn btn-outline" style="margin-top: 10px;" onclick="copyToClipboard('${escapeHtml(hash.value)}')"><i class="fas fa-copy"></i> Copy</button>
        </div>
    `).join('');

    resultsContainer.style.display = 'block';
}

function clearHashes() {
    document.getElementById('hashInput').value = '';
    document.getElementById('hashResults').style.display = 'none';
    generatedHashes = [];
}

function copyAllHashes() {
    const text = generatedHashes.map(h => `${h.name}: ${h.value}`).join('\n');
    copyToClipboard(text);
    showToast('All hashes copied to clipboard');
}

function addHashesToReport() {
    if (generatedHashes.length === 0) return;
    addToReport('Hash Generator', generatedHashes.map(h => `${h.name}: ${h.value}`), 'Generated hashes and encodings');
}

// Hash helper functions
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha1(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha512(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function md5(message) {
    // Simple MD5 implementation
    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586); c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426); c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417); c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101); c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632); c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083); c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690); c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784); c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463); c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353); c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222); c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835); c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415); c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606); c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744); c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379); c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
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
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) { md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0; }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }
    function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) { md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24); }
        return md5blks;
    }
    var hex_chr = '0123456789abcdef'.split('');
    function rhex(n) {
        var s = '', j = 0;
        for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }
    function hex(x) { for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]); return x.join(''); }
    function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
    return hex(md51(message));
}

function stringToHex(str) {
    return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

function hexToString(hex) {
    hex = hex.replace(/\s/g, '');
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

function stringToBinary(str) {
    return Array.from(str).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

function binaryToString(binary) {
    return binary.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
}

function rot13(str) {
    return str.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));
}

function htmlEncode(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/g, c => '&#' + c.charCodeAt(0) + ';');
}

function htmlDecode(str) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
}

// ==================== Module 7: IP Calculator ====================
function calculateIP() {
    const ipInput = document.getElementById('ipInput').value.trim();
    const subnetMaskInput = document.getElementById('subnetMask').value.trim();

    if (!ipInput) {
        showToast('Please enter an IP address or CIDR notation');
        return;
    }

    let ip, cidr;

    if (ipInput.includes('/')) {
        [ip, cidr] = ipInput.split('/');
        cidr = parseInt(cidr);
    } else {
        ip = ipInput;
        if (subnetMaskInput) {
            cidr = subnetMaskToCIDR(subnetMaskInput);
        } else {
            cidr = 24; // Default
        }
    }

    if (!isValidIP(ip)) {
        showToast('Invalid IP address');
        return;
    }

    if (cidr < 0 || cidr > 32) {
        showToast('Invalid CIDR notation (must be 0-32)');
        return;
    }

    const ipLong = ipToLong(ip);
    const mask = cidrToMask(cidr);
    const maskLong = ipToLong(mask);
    const networkLong = ipLong & maskLong;
    const broadcastLong = networkLong | (~maskLong >>> 0);
    const firstHostLong = networkLong + 1;
    const lastHostLong = broadcastLong - 1;
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr < 31 ? totalHosts - 2 : (cidr === 31 ? 2 : 1);

    ipCalculationResults = {
        'IP Address': ip,
        'CIDR Notation': `/${cidr}`,
        'Subnet Mask': mask,
        'Network Address': longToIP(networkLong),
        'Broadcast Address': longToIP(broadcastLong),
        'First Usable Host': longToIP(firstHostLong),
        'Last Usable Host': longToIP(lastHostLong),
        'Total Hosts': totalHosts.toLocaleString(),
        'Usable Hosts': usableHosts.toLocaleString(),
        'IP Class': getIPClass(ip),
        'IP Type': isPrivateIP(ip) ? 'Private' : 'Public',
        'Binary Subnet Mask': ipToBinary(mask),
        'Wildcard Mask': longToIP(~maskLong >>> 0)
    };

    displayIPResults(networkLong, broadcastLong);
}

function displayIPResults(networkLong, broadcastLong) {
    const grid = document.getElementById('ipInfoGrid');
    const rangeList = document.getElementById('ipRangeList');
    const resultsContainer = document.getElementById('ipResults');

    grid.innerHTML = Object.entries(ipCalculationResults).map(([key, value]) => `
        <div class="ip-info-item">
            <label>${key}</label>
            <p>${value}</p>
        </div>
    `).join('');

    // Generate IP range (limit to 256 for display)
    const rangeSize = Math.min(broadcastLong - networkLong + 1, 256);
    const ips = [];
    for (let i = 0; i < rangeSize; i++) {
        ips.push(longToIP(networkLong + i));
    }
    rangeList.textContent = ips.join('\n');

    resultsContainer.style.display = 'block';
    showToast('IP calculation complete');
}

function setIPExample(cidr) {
    const examples = {
        '/8': '10.0.0.0/8',
        '/16': '172.16.0.0/16',
        '/24': '192.168.1.0/24',
        '/32': '192.168.1.1/32'
    };
    document.getElementById('ipInput').value = examples[cidr];
    calculateIP();
}

function clearIP() {
    document.getElementById('ipInput').value = '';
    document.getElementById('subnetMask').value = '';
    document.getElementById('ipResults').style.display = 'none';
    ipCalculationResults = {};
}

function copyIPInfo() {
    const text = Object.entries(ipCalculationResults).map(([k, v]) => `${k}: ${v}`).join('\n');
    copyToClipboard(text);
    showToast('IP information copied to clipboard');
}

function addIPToReport() {
    if (Object.keys(ipCalculationResults).length === 0) return;
    addToReport('IP Calculator', Object.entries(ipCalculationResults).map(([k, v]) => `${k}: ${v}`), `IP calculation for: ${ipCalculationResults['IP Address']}`);
}

// IP helper functions
function isValidIP(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
        const num = parseInt(part);
        return num >= 0 && num <= 255 && part === num.toString();
    });
}

function ipToLong(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

function longToIP(long) {
    return [(long >>> 24) & 255, (long >>> 16) & 255, (long >>> 8) & 255, long & 255].join('.');
}

function cidrToMask(cidr) {
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    return longToIP(mask);
}

function subnetMaskToCIDR(mask) {
    const binary = mask.split('.').map(o => parseInt(o).toString(2).padStart(8, '0')).join('');
    return (binary.match(/1/g) || []).length;
}

function ipToBinary(ip) {
    return ip.split('.').map(o => parseInt(o).toString(2).padStart(8, '0')).join('.');
}

function getIPClass(ip) {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet < 128) return 'Class A';
    if (firstOctet < 192) return 'Class B';
    if (firstOctet < 224) return 'Class C';
    if (firstOctet < 240) return 'Class D (Multicast)';
    return 'Class E (Reserved)';
}

function isPrivateIP(ip) {
    const parts = ip.split('.').map(Number);
    return (parts[0] === 10) ||
           (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
           (parts[0] === 192 && parts[1] === 168) ||
           (parts[0] === 127);
}

// ==================== Module 8: Regex Tester ====================
function testRegex() {
    const pattern = document.getElementById('regexPattern').value;
    const testString = document.getElementById('regexTestString').value;

    if (!pattern) {
        showToast('Please enter a regex pattern');
        return;
    }

    const flags = Array.from(document.querySelectorAll('#regexFlags .checkbox-item.selected input')).map(i => i.value).join('');

    try {
        const regex = new RegExp(pattern, flags);
        regexMatches = [];
        let match;

        if (flags.includes('g')) {
            while ((match = regex.exec(testString)) !== null) {
                regexMatches.push({
                    match: match[0],
                    index: match.index,
                    groups: match.slice(1)
                });
            }
        } else {
            match = regex.exec(testString);
            if (match) {
                regexMatches.push({
                    match: match[0],
                    index: match.index,
                    groups: match.slice(1)
                });
            }
        }

        displayRegexResults(testString, regex);
    } catch (e) {
        showToast('Invalid regex pattern: ' + e.message);
    }
}

function displayRegexResults(testString, regex) {
    const matchList = document.getElementById('regexMatchList');
    const highlighted = document.getElementById('regexHighlighted');
    const resultsContainer = document.getElementById('regexResults');

    document.getElementById('matchCount').textContent = regexMatches.length;

    matchList.innerHTML = regexMatches.map((m, i) => `
        <div class="result-item">
            <span><strong>Match ${i + 1}:</strong> "${escapeHtml(m.match)}" at index ${m.index}</span>
            <button class="btn btn-outline" onclick="copyToClipboard('${escapeHtml(m.match)}')"><i class="fas fa-copy"></i></button>
        </div>
    `).join('') || '<p style="color: var(--gray-dark);">No matches found</p>';

    // Highlight matches in text
    let highlightedText = escapeHtml(testString);
    if (regexMatches.length > 0) {
        highlightedText = testString.replace(regex, match => `<span class="regex-match">${escapeHtml(match)}</span>`);
    }
    highlighted.innerHTML = highlightedText;

    resultsContainer.style.display = 'block';
    showToast(`Found ${regexMatches.length} matches`);
}

function useRegexTemplate(type) {
    const templates = {
        email: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
        ip: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b',
        url: 'https?:\\/\\/[^\\s]+',
        phone: '\\+?[\\d\\s\\-\\(\\)]{10,}',
        ssn: '\\d{3}-\\d{2}-\\d{4}',
        creditcard: '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b',
        apikey: '[a-zA-Z0-9_-]{20,}'
    };
    document.getElementById('regexPattern').value = templates[type];
}

function clearRegex() {
    document.getElementById('regexPattern').value = '';
    document.getElementById('regexTestString').value = '';
    document.getElementById('regexResults').style.display = 'none';
    regexMatches = [];
}

function copyRegexMatches() {
    const text = regexMatches.map(m => m.match).join('\n');
    copyToClipboard(text);
    showToast('Matches copied to clipboard');
}

// ==================== Module 9: Report Builder ====================
function addToReport(category, data, description) {
    const item = {
        id: Date.now(),
        category,
        data: Array.isArray(data) ? data : [data],
        description,
        timestamp: new Date().toISOString()
    };
    reportData.push(item);
    saveReportToStorage();
    updateReportCount();
    updateReportPreview();
    showToast(`Added to report: ${category}`);
}

function updateReportCount() {
    document.getElementById('reportCount').textContent = reportData.length;
    document.getElementById('reportItemCount').textContent = reportData.length;
    const categories = [...new Set(reportData.map(r => r.category))];
    document.getElementById('reportCategories').textContent = categories.length;
}

function updateReportPreview() {
    const container = document.getElementById('reportItems');
    
    if (reportData.length === 0) {
        container.innerHTML = '<p style="color: var(--gray-dark); text-align: center; padding: 40px;">No items in report yet. Add items from other modules using the "Add to Report" button.</p>';
        return;
    }

    container.innerHTML = reportData.map(item => `
        <div class="report-item">
            <div class="report-item-header">
                <h4>${item.category}</h4>
                <button class="btn btn-secondary" onclick="removeFromReport(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
            <p style="color: var(--gray-dark); font-size: 0.9rem;">${item.description}</p>
            <p style="font-size: 0.8rem; color: var(--gray-dark);">${new Date(item.timestamp).toLocaleString()}</p>
            <div class="code-output" style="max-height: 150px; margin-top: 10px;">${item.data.slice(0, 10).join('\n')}${item.data.length > 10 ? `\n... and ${item.data.length - 10} more` : ''}</div>
        </div>
    `).join('');
}

function removeFromReport(id) {
    reportData = reportData.filter(item => item.id !== id);
    saveReportToStorage();
    updateReportCount();
    updateReportPreview();
    showToast('Item removed from report');
}

function clearReport() {
    if (!confirm('Are you sure you want to clear the entire report?')) return;
    reportData = [];
    saveReportToStorage();
    updateReportCount();
    updateReportPreview();
    showToast('Report cleared');
}

function exportReport(format) {
    if (reportData.length === 0) {
        showToast('No data to export');
        return;
    }

    const title = document.getElementById('reportTitle').value || 'OSINT Investigation Report';
    const notes = document.getElementById('reportNotes').value;
    const timestamp = new Date().toISOString();

    let content, filename, mimeType;

    switch (format) {
        case 'json':
            content = JSON.stringify({
                title,
                notes,
                generatedAt: timestamp,
                items: reportData
            }, null, 2);
            filename = 'osint-report.json';
            mimeType = 'application/json';
            break;

        case 'csv':
            const headers = ['Category', 'Description', 'Timestamp', 'Data'];
            const rows = reportData.map(item => [
                item.category,
                item.description,
                item.timestamp,
                item.data.join('; ')
            ]);
            content = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
            filename = 'osint-report.csv';
            mimeType = 'text/csv';
            break;

        case 'txt':
            content = `${title}\n${'='.repeat(title.length)}\n\nGenerated: ${new Date(timestamp).toLocaleString()}\n`;
            if (notes) content += `\nNotes:\n${notes}\n`;
            content += '\n' + '='.repeat(50) + '\n\n';
            reportData.forEach(item => {
                content += `[${item.category}]\n`;
                content += `Description: ${item.description}\n`;
                content += `Time: ${new Date(item.timestamp).toLocaleString()}\n`;
                content += `Data:\n${item.data.join('\n')}\n`;
                content += '\n' + '-'.repeat(30) + '\n\n';
            });
            filename = 'osint-report.txt';
            mimeType = 'text/plain';
            break;
    }

    downloadFile(content, filename, mimeType);
    showToast(`Report exported as ${format.toUpperCase()}`);
}

function saveReportToStorage() {
    try {
        localStorage.setItem('osintReport', JSON.stringify(reportData));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

function loadReportFromStorage() {
    try {
        const saved = localStorage.getItem('osintReport');
        if (saved) {
            reportData = JSON.parse(saved);
            updateReportPreview();
        }
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
    }
}

// ==================== Utility Functions ====================
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard');
    });
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
