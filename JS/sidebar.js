/**
 * sidebar.js - Controlador Multisistema
 * Compatível com iOS, Android, Desktop.
 */

class SidebarApp {
    constructor() {
        // Previne dupla inicialização
        if (document.getElementById('spe-sidebar')) return;
        
        this.isOpen = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        this.injectDOM();
        this.cacheElements();
        this.bindEvents();
        this.highlightCurrentPage();
    }

    injectDOM() {
        const html = `
            <button class="hamburger-btn" id="spe-hamburger" aria-label="Abrir Menu de Navegação" aria-expanded="false">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
            
            <div class="sidebar-overlay" id="spe-overlay" aria-hidden="true"></div>
            
            <aside class="sidebar" id="spe-sidebar" aria-hidden="true">
                <header class="sidebar-header">
                    <div class="sidebar-logo">SPE</div>
                    <span class="sidebar-title">SiteParaEstudar</span>
                    <button class="sidebar-close" id="spe-close" aria-label="Fechar menu">✕</button>
                </header>
                
                <nav class="sidebar-nav">
                    ${this.generateLinks()}
                </nav>
                
                <footer class="sidebar-footer">
                    <div class="footer-info">
                        <span class="footer-text">UFMS · Campus Ponta Porã</span>
                        <span class="footer-version">v2.0</span>
                    </div>
                </footer>
            </aside>
        `;
        document.body.insertAdjacentHTML('afterbegin', html);
    }

    generateLinks() {
        // Removida a barra '/' inicial para compatibilidade com GitHub Pages
        const links = [
            { href: 'index.html', icon: '🏠', color: '#7c6dfa', title: 'Início', sub: 'Página principal' },
            { href: 'pages/home/HomeSemestres.html', icon: '📚', color: '#7c6dfa', title: 'Semestres', sub: 'Home Semestres' },
            { href: 'pages/videosaulas/videos.html', icon: '▶️', color: '#fa6d8a', title: 'Videoaulas', sub: 'Aulas em vídeo' },
            { href: 'pages/biblioteca/livros.html', icon: '📚', color: '#e62e00', title: 'Biblioteca', sub: 'Livros e materiais' },
            { href: 'pages/filmes/filmes.html', icon: '🎬', color: '#9200e6', title: 'Filmes', sub: 'Conteúdo em vídeo' }
        ];

        return links.map(l => `
            <a href="${l.href}" class="sidebar-link">
                <span class="icon" style="background:${this.hexToRgba(l.color, 0.15)}; color:${l.color};">${l.icon}</span> 
                <div class="link-content">
                    <span class="link-title">${l.title}</span>
                    <span class="link-subtitle">${l.sub}</span>
                </div>
            </a>
        `).join('');
    }

    hexToRgba(hex, alpha) {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    cacheElements() {
        this.dom = {
            btn: document.getElementById('spe-hamburger'),
            overlay: document.getElementById('spe-overlay'),
            sidebar: document.getElementById('spe-sidebar'),
            closeBtn: document.getElementById('spe-close'),
            links: document.querySelectorAll('.sidebar-link')
        };
    }

    bindEvents() {
        this.dom.btn.addEventListener('click', () => this.toggle(true));
        this.dom.closeBtn.addEventListener('click', () => this.toggle(false));
        this.dom.overlay.addEventListener('click', () => this.toggle(false));

        this.dom.links.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.toggle(false), 250);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.toggle(false);
        });

        this.dom.sidebar.addEventListener('touchstart', e => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.dom.sidebar.addEventListener('touchend', e => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const threshold = 60;
        if (this.touchStartX - this.touchEndX > threshold) {
            this.toggle(false);
        }
    }

    toggle(forceState) {
        this.isOpen = forceState !== undefined ? forceState : !this.isOpen;

        this.dom.sidebar.classList.toggle('active', this.isOpen);
        this.dom.overlay.classList.toggle('active', this.isOpen);
        this.dom.btn.classList.toggle('active', this.isOpen);
        document.body.classList.toggle('sidebar-is-open', this.isOpen);

        this.dom.sidebar.setAttribute('aria-hidden', !this.isOpen);
        this.dom.btn.setAttribute('aria-expanded', this.isOpen);

        if (this.isOpen && 'vibrate' in navigator) navigator.vibrate(15);
    }

    highlightCurrentPage() {
        let currentPath = window.location.pathname.split('/').pop();
        if (!currentPath || currentPath === '') currentPath = 'index.html';
        
        currentPath = currentPath.split('?')[0].split('#')[0];

        this.dom.links.forEach(link => {
            const rawHref = link.getAttribute('href').split('?')[0].split('#')[0];
            const linkFile = rawHref.split('/').pop(); // Extrai apenas o nome do arquivo para comparar

            if (linkFile === currentPath) {
                link.classList.add('active-link');
                const icon = link.querySelector('.icon');
                if (icon) {
                    icon.style.transform = 'scale(1.15)';
                    icon.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
                }
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SidebarApp());
} else {
    new SidebarApp();
}