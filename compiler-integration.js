// compiler-integration.js - Integração C/Python
(function() {
    'use strict';

    // Estado atual da linguagem
    let currentLanguage = 'c';

    // Função para alternar entre C e Python
    function switchLanguage(lang) {
        currentLanguage = lang;
        
        // Atualizar botões das abas
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Atualizar visibilidade dos exemplos
        document.getElementById('examples-c').style.display = lang === 'c' ? 'inline-flex' : 'none';
        document.getElementById('examples-python').style.display = lang === 'python' ? 'inline-flex' : 'none';
        
        // Atualizar status
        const statusText = document.getElementById('status-text');
        if (lang === 'c') {
            statusText.textContent = '🔵 Modo C';
            statusText.style.color = '#3498db';
            document.getElementById('output-area').textContent = '// Código C - Ctrl+Enter para compilar';
        } else {
            statusText.textContent = '🟡 Modo Python';
            statusText.style.color = '#f1c40f';
            document.getElementById('output-area').textContent = '# Código Python - Ctrl+Enter para executar';
        }
        
        // Atualizar placeholder do editor
        const codeArea = document.getElementById('code-area');
        if (codeArea) {
            codeArea.placeholder = lang === 'c' ? '// Digite seu código C aqui...' : '# Digite seu código Python aqui...';
        }
    }

    // Função unificada de execução
    async function compileAndRun() {
        if (currentLanguage === 'c') {
            // Usa a função do compiler-c.js
            if (window.compileAndRun) {
                await window.compileAndRun();
            } else {
                console.error('❌ Função compileAndRun não encontrada!');
            }
        } else {
            // Usa a função do compiler-python.js
            if (window.pythonCompileAndRun) {
                await window.pythonCompileAndRun();
            } else {
                console.error('❌ Função pythonCompileAndRun não encontrada!');
            }
        }
    }

    // Função unificada para carregar exemplos
    function loadExample(name) {
        if (currentLanguage === 'c') {
            if (window.loadExample) {
                window.loadExample(name);
            }
        } else {
            if (window.loadPythonExample) {
                window.loadPythonExample(name);
            }
        }
    }

    // Função unificada para limpar
    function clearCode() {
        if (currentLanguage === 'c') {
            if (window.clearCode) {
                window.clearCode();
            }
        } else {
            if (window.clearPythonCode) {
                window.clearPythonCode();
            }
        }
    }

    // ========== SOBRESCREVER EVENTO CTRL+ENTER ==========
    // Remove o listener antigo e adiciona o novo
    document.removeEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (window.compileAndRun) window.compileAndRun();
        }
    });

    // Adiciona o novo listener unificado
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            compileAndRun();
        }
    });

    // ========== EXPORTAÇÃO GLOBAL ==========
    window.switchLanguage = switchLanguage;
    window.compileAndRun = compileAndRun;
    window.loadExample = loadExample;
    window.clearCode = clearCode;
    window.currentLanguage = currentLanguage;

    console.log('✅ Integração C/Python carregada!');
    console.log('📝 Linguagem atual:', currentLanguage);
})();