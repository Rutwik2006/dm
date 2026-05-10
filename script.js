document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navMenu = document.getElementById('nav-menu');
    const contentContainer = document.getElementById('content-container');
    const topbarTitle = document.getElementById('current-section-title');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');

    let currentIndex = 0;

    // Initialize Application
    function init() {
        if (typeof courseData === 'undefined' || !courseData.length) {
            contentContainer.innerHTML = '<h2>Error: Data not loaded.</h2>';
            return;
        }

        buildNavigation();
        loadSection(0);
        setupTheme();
        setupEventListeners();
    }

    // Build Sidebar Navigation
    function buildNavigation() {
        navMenu.innerHTML = '';
        courseData.forEach((section, index) => {
            const navItem = document.createElement('a');
            navItem.className = 'nav-item';
            navItem.id = `nav-${index}`;
            navItem.innerHTML = `
                <i class="${section.icon}"></i>
                <span>${section.title}</span>
            `;
            
            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                loadSection(index);
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
            
            navMenu.appendChild(navItem);
        });
    }

    // Load Content Section
    function loadSection(index) {
        if (index < 0 || index >= courseData.length) return;
        
        currentIndex = index;
        const section = courseData[index];
        
        // Re-trigger animation
        contentContainer.style.animation = 'none';
        contentContainer.offsetHeight; /* trigger reflow */
        contentContainer.style.animation = null; 

        // Inject HTML
        contentContainer.innerHTML = section.content;
        topbarTitle.textContent = section.title;

        // Update Active Nav
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        document.getElementById(`nav-${index}`).classList.add('active');

        // Scroll top
        document.getElementById('main-content').scrollTop = 0;

        // Update Buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === courseData.length - 1;
    }

    // Event Listeners
    function setupEventListeners() {
        prevBtn.addEventListener('click', () => loadSection(currentIndex - 1));
        nextBtn.addEventListener('click', () => loadSection(currentIndex + 1));

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('dm-theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });

        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Theme Management
    function setupTheme() {
        const savedTheme = localStorage.getItem('dm-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        updateThemeIcon(isDark);
    }

    function updateThemeIcon(isDark) {
        themeToggle.innerHTML = isDark 
            ? '<i class="fa-solid fa-sun"></i>' 
            : '<i class="fa-solid fa-moon"></i>';
    }

    // Run
    init();
});
