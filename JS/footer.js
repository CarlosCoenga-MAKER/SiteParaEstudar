// footer.js - Rodapé unificado para SiteParaEstudar
// Para usar: <script src="footer.js"></script> antes de </body>

(function() {
    // Criar elemento de rodapé
    const footerHTML = `
        <style>
            .site-footer {
                position: relative;
                z-index: 10;
                background: rgba(13, 13, 15, 0.95);
                backdrop-filter: blur(20px);
                border-top: 1px solid var(--border, #2a2a38);
                padding: 30px 20px 40px;
                margin-top: 60px;
                text-align: center;
                font-family: 'Inter', 'Syne', sans-serif;
            }

            .footer-grid {
                max-width: 900px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 30px;
                text-align: left;
                margin-bottom: 30px;
            }

            .footer-col h4 {
                font-family: 'Syne', sans-serif;
                font-size: 14px;
                font-weight: 700;
                color: #e8e8f0;
                margin-bottom: 12px;
                letter-spacing: -0.3px;
            }

            .footer-col ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .footer-col li {
                margin-bottom: 8px;
            }

            .footer-col a {
                color: #7878a0;
                text-decoration: none;
                font-size: 12px;
                transition: color 0.2s ease;
                font-weight: 400;
            }

            .footer-col a:hover {
                color: #7c6dfa;
            }

            .footer-divider {
                border: none;
                border-top: 1px solid #2a2a38;
                max-width: 900px;
                margin: 0 auto 20px;
            }

            .footer-bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 15px;
                max-width: 900px;
                margin: 0 auto;
                font-size: 11px;
                color: #7878a0;
                font-family: 'Space Mono', monospace;
            }

            .footer-credits {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .footer-logo-small {
                width: 24px;
                height: 24px;
                background: linear-gradient(135deg, #7c6dfa, #6dfabc);
                border-radius: 6px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 11px;
                color: #fff;
            }

            .footer-status {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 10px;
                color: #2ecc71;
            }

            .footer-status .dot {
                width: 7px;
                height: 7px;
                background: #2ecc71;
                border-radius: 50%;
                animation: pulse-dot 2s infinite;
            }

            @keyframes pulse-dot {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }

            @media (max-width: 600px) {
                .footer-grid {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
                .footer-bottom {
                    flex-direction: column;
                    text-align: center;
                }
            }
        </style>

        <footer class="site-footer">
            <div class="footer-grid">
                <div class="footer-col">
                    <h4>📚 Matemática</h4>
                    <ul>
                        <li><a href="/pages/matematica/ListaConjuntos.html">Teoria dos Conjuntos</a></li>
                        <li><a href="/pages/matematica/exercicios-relacoes.html">Relações Binárias</a></li>
                        <li><a href="/pages/matematica/exercicios-funcoes.html">Funções</a></li>
                        <li><a href="/pages/matematica/exercicios-combinatoria.html">Combinatória</a></li>
                        <li><a href="/pages/matematica/matematica.html">Prova Completa (24Q)</a></li>
                        <li><a href="/pages/matematica/prova1Avaliativa.html">Prova Avaliativa 1</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>📚 Programação em C</h4>
                    <ul>
                        <li><a href="/pages/listaProgramacao/compilador-c.html">Copilador C</a></li>
                        <li><a href="/pages/listaProgramacao/questoes-c.html">Questões em C</a></li>
                        
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>📋 Administração</h4>
                    <ul>
                        <li><a href="/pages/adm/mapa_mental_Adm.html">Mapa Mental</a></li>
                        <li><a href="/pages/adm/casos.html">Casos de Administração</a></li>
                        <li><a href="/pages/adm/casos.html#adm-cientifica">Adm. Científica</a></li>
                        <li><a href="/pages/adm/casos.html#teoria-classica">Teoria Clássica</a></li>
                        <li><a href="/pages/adm/casos.html#relacoes-humanas">Relações Humanas</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>🔗 Links Rápidos</h4>
                    <ul>
                        <li><a href="/index.html">🏠 Início</a></li>
                        <li><a href="/pages/home/HomeMatematica.html">∑ Home Matemática</a></li>
                        <li><a href="/pages/home/HomeProgramacao.html">💻 Home Programação em C</a></li>
                        <li><a href="/pages/videosaulas/videos.html">▶️ Videos Aulas</a></li>
                        <li><a href="/pages/biblioteca/livros.html">📚 Biblioteca</a></li>
                         <li><a href="/pages/filmes/filmes.html">🎬 Filmes</a></li>
                        <li><a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">⬆ Voltar ao Topo</a></li>
                    </ul>
                </div>
                
            </div>
            
            <hr class="footer-divider">
            
            <div class="footer-bottom">
                <div class="footer-credits">
                    <span class="footer-logo-small">SPE</span>
                    <span>SiteParaEstudar © 2026</span>
                </div>
                <div>UFMS · Campus Ponta Porã</div>
                <div class="footer-status">
                    <span class="dot"></span>
                    <span>Todos os gabaritos verificados</span>
                </div>
            </div>
        </footer>
    `;

    // Inserir rodapé no final do body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
})();
