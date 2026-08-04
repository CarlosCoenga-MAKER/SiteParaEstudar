// ========== EXEMPLOS ==========
const examples = {
    hello: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    printf("SiteParaEstudar © 2026\\n");\n    return 0;\n}',
    menorNumero: '#include <stdio.h>\n\nint main() {\n    int x, i, menor;\n    printf("Digite o 1o numero: ");\n    scanf("%d", &x);\n    menor = x;\n    for(i = 2; i <= 5; i++) {\n        printf("Digite o %do numero: ", i);\n        scanf("%d", &x);\n        if(x < menor) menor = x;\n    }\n    printf("\\nO menor numero foi: %d\\n", menor);\n    return 0;\n}',
    fatorial: '#include <stdio.h>\n\nint main() {\n    int n, i;\n    long long fat = 1;\n    scanf("%d", &n);\n    for(i = 1; i <= n; i++) fat *= i;\n    printf("%d! = %lld\\n", n, fat);\n    return 0;\n}',
    calculadora: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    char op;\n    printf("Digite a operacao: ");\n    scanf("%d%c%d", &a, &op, &b);\n    switch(op) {\n        case \'+\': printf("%d + %d = %d\\n", a, b, a+b); break;\n        case \'-\': printf("%d - %d = %d\\n", a, b, a-b); break;\n        case \'*\': printf("%d * %d = %d\\n", a, b, a*b); break;\n        case \'/\':\n            if(b != 0) printf("%d / %d = %d\\n", a, b, a/b);\n            else printf("Erro: divisao por zero!\\n");\n            break;\n    }\n    return 0;\n}',
    tabuada: '#include <stdio.h>\n\nint main() {\n    int n, i;\n    scanf("%d", &n);\n    for(i = 1; i <= 10; i++)\n        printf("%d x %d = %d\\n", n, i, n * i);\n    return 0;\n}'
};

// ========== HIGHLIGHT ==========
function highlightC(code) {
    return code
        .replace(/^(#include)\s+(<.*?>)/gm, '<span class="preprocessor">$1</span> <span class="header-file">$2</span>')
        .replace(/(\/\/.*)/g, '<span class="comment">$1</span>')
        .replace(/"([^"\\]|\\.)*"/g, '<span class="string">$&</span>')
        .replace(/%[dfsclu]/g, '<span class="format">$&</span>')
        .replace(/\b(int|float|double|char|void|long|short|unsigned|signed|const|static|extern|struct|enum|typedef|sizeof)\b/g, '<span class="type">$1</span>')
        .replace(/\b(if|else|for|while|do|switch|case|break|continue|return|goto|default)\b/g, '<span class="keyword">$1</span>')
        .replace(/\b(printf|scanf|puts|gets|putchar|getchar|fopen|fclose|fprintf|fscanf|malloc|calloc|free|main)\b/g, '<span class="function">$1</span>')
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
        .replace(/(\{|\})/g, '<span class="brace">$1</span>');
}

function syncHighlight() {
    const ta = document.getElementById('code-textarea');
    const hl = document.getElementById('code-highlight');
    const lineNumbers = document.getElementById('line-numbers');
    
    if (ta && hl) {
        const sanitized = ta.value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        hl.innerHTML = highlightC(sanitized);
        
        if (lineNumbers) {
            const lines = ta.value.split('\n');
            const lineCount = lines.length || 1;
            let lineNumbersHtml = '';
            for (let i = 1; i <= lineCount; i++) {
                lineNumbersHtml += i + '\n';
            }
            lineNumbers.textContent = lineNumbersHtml;
        }
    }
}

function syncScroll() {
    const ta = document.getElementById('code-textarea');
    const hl = document.getElementById('code-highlight');
    const lineNumbers = document.getElementById('line-numbers');
    
    if (ta && hl) {
        hl.scrollTop = ta.scrollTop;
        hl.scrollLeft = ta.scrollLeft;
    }
    
    if (lineNumbers) {
        lineNumbers.scrollTop = ta.scrollTop;
    }
}

// ========== MODAL ==========
function openModal() {
    const code = document.getElementById('code-textarea').value;
    if (!code.trim()) {
        showToast('⚠️ O código está vazio!', '#e74c3c');
        return;
    }
    document.getElementById('modal-overlay').classList.add('show');
    document.getElementById('filename-input').focus();
    document.getElementById('filename-input').select();
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('show');
}

function confirmSave() {
    let filename = document.getElementById('filename-input').value.trim();
    
    if (!filename.endsWith('.c')) {
        filename += '.c';
    }
    
    filename = filename.replace(/[<>:"/\\|?*]/g, '_');
    
    saveCode(filename);
    closeModal();
}

// ========== SALVAR ARQUIVO ==========
function saveCode(filename) {
    const code = document.getElementById('code-textarea').value;
    
    if (!code.trim()) {
        showToast('⚠️ O código está vazio!', '#e74c3c');
        return;
    }
    
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    showToast('💾 Arquivo ' + filename + ' salvo com sucesso!', '#9C27B0');
}

// ========== DOWNLOAD RÁPIDO ==========
function downloadCode() {
    const code = document.getElementById('code-textarea').value;
    
    if (!code.trim()) {
        showToast('⚠️ O código está vazio!', '#e74c3c');
        return;
    }
    
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'programa.c';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    showToast('📥 Baixado como programa.c!', '#FF9800');
}

// ========== TOAST ==========
function showToast(message, color = '#2ecc71') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = color;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Fechar modal com ESC ou clicando fora
document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Fecha o modal se estiver aberto
        const modal = document.getElementById('modal-overlay');
        if (modal.classList.contains('show')) {
            closeModal();
            return;
        }
        // Fecha o editor expandido
        const wrapper = document.getElementById('code-editor-wrapper');
        if (wrapper && wrapper.classList.contains('expanded')) {
            toggleExpand();
        }
    }
});

// Enter no input do modal
document.getElementById('filename-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        confirmSave();
    }
});

// ========== EXPANDIR - CORRIGIDO ==========
function toggleExpand(e) {
    if (e) e.stopPropagation();

    const wrapper = document.getElementById('code-editor-wrapper');
    const overlay = document.getElementById('code-overlay');
    const btn = document.querySelector('.btn-expand');

    if (!wrapper || !overlay) return;

    const isExpanded = wrapper.classList.contains('expanded');

    if (!isExpanded) {
        wrapper.classList.add('expanded');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        if (btn) btn.innerHTML = '⛶ Recolher';
    } else {
        wrapper.classList.remove('expanded');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        if (btn) btn.innerHTML = '⛶ Expandir';
    }

    setTimeout(syncHighlight, 50);
}

// ========== COMPILAR ==========
async function compileAndRun() {
    const code = document.getElementById('code-textarea').value.trim();
    const input = document.getElementById('input-area').value;
    const outputArea = document.getElementById('output-area');
    const runBtn = document.getElementById('run-btn');
    const spinner = document.getElementById('spinner');
    const statusText = document.getElementById('status-text');
    
    if (!code) { outputArea.textContent = '⚠️ Digite um código C!'; return; }
    
    runBtn.disabled = true;
    spinner.classList.add('show');
    outputArea.textContent = '🔄 Compilando com GCC...';
    statusText.textContent = '⏳ Compilando...';
    statusText.style.color = '#fadc6d';
    
    try {
        const response = await fetch('https://siteparaestudar.onrender.com/compilar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, input })
        });
        
        const result = await response.json();
        
        let output = '';
        if (result.error) output += '❌ ERROS:\n' + result.error + '\n\n';
        if (result.output) output += '📤 SAÍDA:\n' + result.output;
        if (!result.output && !result.error) output = '✅ Executado! (sem saída)';
        
        outputArea.textContent = output;
        statusText.textContent = result.success ? '✅ Sucesso!' : '❌ Erro';
        statusText.style.color = result.success ? '#2ecc71' : '#e74c3c';
        
    } catch (error) {
        outputArea.textContent = '❌ ERRO DE CONEXÃO\n\nVerifique sua internet e tente novamente.';
        statusText.textContent = '❌ Sem conexão';
        statusText.style.color = '#e74c3c';
    } finally {
        runBtn.disabled = false;
        spinner.classList.remove('show');
    }
}

function loadExample(name) {
    if (examples[name]) {
        document.getElementById('code-textarea').value = examples[name];
        document.getElementById('output-area').textContent = '✅ Exemplo carregado! Ctrl+Enter para executar.';
        syncHighlight();
    }
}

function clearCode() {
    document.getElementById('code-textarea').value = '';
    document.getElementById('input-area').value = '';
    document.getElementById('output-area').textContent = '// Digite seu código C...';
    syncHighlight();
    showToast('🧹 Editor limpo!', '#2196F3');
}

function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        compileAndRun();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        openModal();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        downloadCode();
    }
    if (e.key === 'Tab') {
        e.preventDefault();
        const s = e.target.selectionStart;
        e.target.value = e.target.value.substring(0, s) + '    ' + e.target.value.substring(e.target.selectionEnd);
        e.target.selectionStart = e.target.selectionEnd = s + 4;
        syncHighlight();
    }
}

// Inicializar
document.getElementById('code-textarea').value = examples.hello;
syncHighlight();

// Ping backend
fetch('https://siteparaestudar.onrender.com/ping')
    .then(r => r.json())
    .then(d => {
        document.getElementById('status-text').textContent = d.gcc ? '🟢 Online' : '🔴 Offline';
        document.getElementById('status-text').style.color = d.gcc ? '#2ecc71' : '#e74c3c';
    })
    .catch(() => {
        document.getElementById('status-text').textContent = '🔴 Offline';
        document.getElementById('status-text').style.color = '#e74c3c';
    });

// ========== CORREÇÃO DO BUG DO OVERLAY ==========
// O overlay só fecha o editor quando clicado DIRETAMENTE nele
document.getElementById('code-overlay').addEventListener('click', function(e) {
    // Só fecha se o clique foi EXATAMENTE no overlay, não nos elementos filhos
    if (e.target === this) {
        const wrapper = document.getElementById('code-editor-wrapper');
        if (wrapper && wrapper.classList.contains('expanded')) {
            toggleExpand();
        }
    }
    // Impede que cliques no overlay se propaguem para elementos abaixo
    e.stopPropagation();
});

// Impede que cliques dentro do editor expandido fechem o overlay
document.getElementById('code-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        toggleExpand();
    }
});

// ========== TORNE AS FUNÇÕES ACESSÍVEIS GLOBALMENTE ==========
window.compileAndRun = compileAndRun;
window.loadExample = loadExample;
window.clearCode = clearCode;
window.pythonCompileAndRun = pythonCompileAndRun;
window.loadPythonExample = loadPythonExample;
window.toggleExpand = toggleExpand;
window.saveCode = saveCode;
window.downloadCode = downloadCode;

// ========== DETECTAR LINGUAGEM ATUAL ==========
let currentLanguage = 'c';

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Atualizar botões
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Atualizar status
    const statusText = document.getElementById('status-text');
    if (lang === 'c') {
        statusText.textContent = '🔵 Modo C';
        statusText.style.color = '#3498db';
        // Mudar placeholder do output
        document.getElementById('output-area').textContent = '// Código C - Ctrl+Enter para compilar';
        // Mudar dicas de exemplo
        updateExampleButtons('c');
    } else {
        statusText.textContent = '🟡 Modo Python';
        statusText.style.color = '#f1c40f';
        document.getElementById('output-area').textContent = '# Código Python - Ctrl+Enter para executar';
        updateExampleButtons('python');
    }
}

function updateExampleButtons(lang) {
    // Implementar se quiser mostrar diferentes exemplos nos botões
    console.log('Linguagem alterada para:', lang);
}

// ========== OVERRIDE DO COMPILEANDRUN ==========
// Substitui a função original para decidir qual usar
const originalCompileAndRun = compileAndRun;
compileAndRun = function() {
    if (currentLanguage === 'c') {
        originalCompileAndRun();
    } else {
        pythonCompileAndRun();
    }
};

// ========== OVERRIDE DO LOADEXAMPLE ==========
const originalLoadExample = loadExample;
loadExample = function(name) {
    if (currentLanguage === 'c') {
        originalLoadExample(name);
    } else {
        loadPythonExample(name);
    }
};