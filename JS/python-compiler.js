// python-compiler.js - Compilador Python Online (Frontend GitHub Pages + Backend Render)
// Backend: https://seu-backend-python.onrender.com

(function() {
    'use strict';

    // ✅ URL DO BACKEND NO RENDER (SUBSTITUA PELA SUA URL)
    const BACKEND_URL = 'https://seu-backend-python.onrender.com';

    // Exemplos de código Python
    const examples = {
        hello: `# Hello World em Python
print("Hello, World!")
print("SiteParaEstudar © 2026")

# Exemplo de variáveis
nome = "Python"
ano = 1991
print(f"Linguagem: {nome} - Criada em {ano}")`,

        menorNumero: `# Encontrar o menor número em uma lista
def encontrar_menor(numeros):
    if not numeros:
        return None
    menor = numeros[0]
    for num in numeros:
        if num < menor:
            menor = num
    return menor

# Entrada do usuário
numeros = []
print("Digite números (digite 'fim' para parar):")

while True:
    entrada = input("> ")
    if entrada.lower() == 'fim':
        break
    try:
        numeros.append(int(entrada))
    except ValueError:
        print("Digite um número válido!")

if numeros:
    menor = encontrar_menor(numeros)
    print(f"O menor número digitado foi: {menor}")
    print(f"Lista completa: {numeros}")
else:
    print("Nenhum número foi digitado.")`,

        calculadora: `# Calculadora simples
def calculadora():
    print("=== CALCULADORA PYTHON ===")
    print("Operações: + (soma), - (subtração), * (multiplicação), / (divisão)")
    
    try:
        num1 = float(input("Digite o primeiro número: "))
        op = input("Digite a operação (+, -, *, /): ")
        num2 = float(input("Digite o segundo número: "))
        
        if op == '+':
            resultado = num1 + num2
        elif op == '-':
            resultado = num1 - num2
        elif op == '*':
            resultado = num1 * num2
        elif op == '/':
            if num2 == 0:
                print("Erro: Divisão por zero!")
                return
            resultado = num1 / num2
        else:
            print("Operação inválida!")
            return
        
        print(f"{num1} {op} {num2} = {resultado}")
        
    except ValueError:
        print("Erro: Digite números válidos!")

if __name__ == "__main__":
    calculadora()`,

        fatorial: `# Cálculo de fatorial
def fatorial(n):
    if n < 0:
        return None
    if n == 0 or n == 1:
        return 1
    resultado = 1
    for i in range(2, n + 1):
        resultado *= i
    return resultado

# Programa principal
try:
    num = int(input("Digite um número para calcular o fatorial: "))
    resultado = fatorial(num)
    if resultado is None:
        print("Não existe fatorial de número negativo!")
    else:
        print(f"O fatorial de {num} é: {resultado}")
        
        # Mostrar passo a passo
        print(f"\nCálculo: {num}! = ", end="")
        for i in range(num, 0, -1):
            print(i, end="")
            if i > 1:
                print(" × ", end="")
        print(f" = {resultado}")
        
except ValueError:
    print("Por favor, digite um número inteiro válido!")`,

        tabuada: `# Tabuada interativa
def tabuada(numero, ate=10):
    print(f"=== TABUADA DO {numero} ===")
    for i in range(1, ate + 1):
        print(f"{numero} × {i:2} = {numero * i:3}")

# Programa principal
try:
    num = int(input("Digite um número para ver a tabuada: "))
    tabuada(num)
    
    # Opção de tabuada personalizada
    opcao = input("\nDeseja ver até um número específico? (s/n): ").lower()
    if opcao == 's':
        ate = int(input("Até qual número? "))
        tabuada(num, ate)
        
except ValueError:
    print("Por favor, digite um número inteiro válido!")`,

        lista: `# Manipulação de listas em Python
def main():
    print("=== MANIPULAÇÃO DE LISTAS ===")
    
    # Criando uma lista
    lista = []
    print("Digite números para adicionar à lista (digite 'fim' para parar):")
    
    while True:
        entrada = input("> ")
        if entrada.lower() == 'fim':
            break
        try:
            lista.append(int(entrada))
        except ValueError:
            print("Digite um número válido!")
    
    if not lista:
        print("Lista vazia!")
        return
    
    print(f"\nLista original: {lista}")
    print(f"Tamanho: {len(lista)} elementos")
    print(f"Maior valor: {max(lista)}")
    print(f"Menor valor: {min(lista)}")
    print(f"Soma: {sum(lista)}")
    print(f"Média: {sum(lista) / len(lista):.2f}")
    
    # Ordenação
    lista_ordenada = sorted(lista)
    print(f"Lista ordenada: {lista_ordenada}")
    
    # Lista reversa
    lista.reverse()
    print(f"Lista invertida: {lista}")

if __name__ == "__main__":
    main()`
    };

    /**
     * Executa o código Python via backend
     */
    async function compileAndRun() {
        const codeTextarea = document.getElementById('code-textarea');
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-area');
        const runBtn = document.getElementById('run-btn');
        const spinner = document.getElementById('spinner');
        const statusText = document.getElementById('status-text');

        if (!codeTextarea || !outputArea) {
            console.error('❌ Elementos da interface não encontrados!');
            return;
        }

        const code = codeTextarea.value.trim();
        const input = inputArea ? inputArea.value : '';

        if (!code) {
            outputArea.textContent = '⚠️ Digite um código Python!';
            return;
        }

        // Ativa estado de loading
        if (runBtn) runBtn.disabled = true;
        if (spinner) spinner.classList.add('active');
        outputArea.textContent = '🔄 Enviando para execução...\n⏳ Aguarde a resposta do servidor...\n\n💡 Dica: O Render pode demorar até 50 segundos\npara iniciar se estiver em cold start.';
        if (statusText) {
            statusText.textContent = '⏳ Executando...';
            statusText.style.color = '#ffd43b';
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos de timeout

            const response = await fetch(`${BACKEND_URL}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, input }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ${response.status}: ${errorText.substring(0, 100)}`);
            }

            const result = await response.json();

            let output = '';

            // Erros de execução
            if (result.error) {
                output += '══════════════════════\n';
                output += '  ❌ ERRO:\n';
                output += '══════════════════════\n\n';
                output += result.output || result.error + '\n';
            } else {
                // Saída do programa
                if (result.output) {
                    output += '══════════════════════\n';
                    output += '  📤 SAÍDA:\n';
                    output += '══════════════════════\n\n';
                    output += result.output;
                } else {
                    output = '✅ Programa executado com sucesso!\n(Sem saída de texto)';
                }
            }

            outputArea.textContent = output;
            outputArea.className = result.error ? 'error' : 'success';

            if (statusText) {
                statusText.textContent = result.error ? '❌ Erro na execução' : '✅ Executado com sucesso!';
                statusText.className = result.error ? 'error' : 'success';
            }

        } catch (error) {
            let errorMessage = '❌ ERRO DE CONEXÃO\n\n';
            
            if (error.name === 'AbortError') {
                errorMessage += '⏱️ Timeout (60s): O servidor demorou muito para responder.\n\n';
                errorMessage += '📋 Possíveis causas:\n';
                errorMessage += '• Render está em cold start (pode levar até 50s)\n';
                errorMessage += '• Tente novamente em alguns segundos\n';
            } else {
                errorMessage += '━━━━━━━━━━━━━━━━━━━━━━━\n';
                errorMessage += '📋 Verifique:\n';
                errorMessage += '━━━━━━━━━━━━━━━━━━━━━━━\n\n';
                errorMessage += `1. Backend Render está online?\n`;
                errorMessage += `   🔗 ${BACKEND_URL}/ping\n\n`;
                errorMessage += '2. O Render gratuito desliga após 15min\n';
                errorMessage += '   de inatividade (cold start)\n\n';
                errorMessage += '3. Tente novamente em 30-50 segundos\n\n';
                errorMessage += `Erro técnico: ${error.message}`;
            }

            outputArea.textContent = errorMessage;
            outputArea.className = 'error';

            if (statusText) {
                statusText.textContent = '❌ Erro de conexão';
                statusText.className = 'error';
            }
        } finally {
            if (runBtn) runBtn.disabled = false;
            if (spinner) spinner.classList.remove('active');
        }
    }

    /**
     * Carrega um exemplo de código Python
     */
    function loadExample(name) {
        const codeTextarea = document.getElementById('code-textarea');
        const outputArea = document.getElementById('output-area');
        const statusText = document.getElementById('status-text');

        if (!codeTextarea) return;

        if (examples[name]) {
            codeTextarea.value = examples[name];

            // Define inputs para cada exemplo
            const inputArea = document.getElementById('input-area');
            if (inputArea) {
                const inputs = {
                    menorNumero: '45\n23\n67\n12\n89',
                    fatorial: '5',
                    calculadora: '5\n+\n3',
                    tabuada: '7',
                    lista: '45\n23\n67\n12\n89\nfim'
                };
                inputArea.value = inputs[name] || '';
            }

            // Disparar eventos para sincronizar highlight
            codeTextarea.dispatchEvent(new Event('input'));
            codeTextarea.dispatchEvent(new Event('scroll'));

            if (outputArea) {
                outputArea.textContent = '✅ Exemplo carregado! Ctrl+Enter para executar.\n\n📝 Código pronto. Clique em "Executar Código" ou\npressione Ctrl+Enter para rodar no servidor Render.';
                outputArea.className = '';
            }
            if (statusText) {
                statusText.textContent = '📝 ' + name;
                statusText.className = '';
            }
        }
    }

    /**
     * Limpa o editor e áreas
     */
    function clearCode() {
        const codeTextarea = document.getElementById('code-textarea');
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-area');
        const statusText = document.getElementById('status-text');

        if (codeTextarea) {
            codeTextarea.value = '';
            codeTextarea.dispatchEvent(new Event('input'));
        }
        if (inputArea) inputArea.value = '';
        if (outputArea) {
            outputArea.textContent = '# Digite seu código Python e pressione Ctrl+Enter';
            outputArea.className = '';
        }
        if (statusText) {
            statusText.textContent = 'Pronto';
            statusText.className = '';
        }
    }

    /**
     * Salva o código atual
     */
    function saveCode() {
        const codeTextarea = document.getElementById('code-textarea');
        if (!codeTextarea) return;

        const code = codeTextarea.value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'programa.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ========== EVENT LISTENERS ==========
    
    // Ctrl+Enter para executar
    document.addEventListener('keydown', function(e) {
        const target = e.target;
        // Não capturar se estiver no input area
        if (target && target.id === 'input-area') return;
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            compileAndRun();
        }
    });

    // Tab para indentar (4 espaços)
    const codeTextarea = document.getElementById('code-textarea');
    if (codeTextarea) {
        codeTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                if (this.selectionStart !== this.selectionEnd) {
                    // Indentar múltiplas linhas
                    const lines = this.value.split('\n');
                    const selectedLines = [];
                    let lineStart = 0;
                    let lineEnd = 0;
                    
                    // Encontrar início e fim da seleção
                    for (let i = 0; i < lines.length; i++) {
                        if (lineStart + lines[i].length + 1 <= start) {
                            lineStart += lines[i].length + 1;
                        }
                        if (lineEnd + lines[i].length + 1 <= end) {
                            lineEnd += lines[i].length + 1;
                        }
                    }
                    
                    // Indentar linhas selecionadas
                    const startLine = this.value.substring(0, start).split('\n').length - 1;
                    const endLine = this.value.substring(0, end).split('\n').length - 1;
                    
                    const linesArray = this.value.split('\n');
                    for (let i = startLine; i <= endLine; i++) {
                        linesArray[i] = '    ' + linesArray[i];
                    }
                    
                    this.value = linesArray.join('\n');
                    this.selectionStart = start + 4;
                    this.selectionEnd = end + 4 * (endLine - startLine + 1);
                } else {
                    // Indentar uma linha
                    this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start + 4;
                }
                
                // Disparar evento para atualizar highlight
                this.dispatchEvent(new Event('input'));
            }
        });
    }

    // Verifica conexão com o backend ao carregar
    async function checkBackendConnection() {
        const statusText = document.getElementById('status-text');
        
        try {
            const response = await fetch(`${BACKEND_URL}/ping`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Backend Render online:', data);
                if (statusText) {
                    statusText.textContent = '🟢 Python Online (Render)';
                    statusText.className = 'success';
                }
            } else {
                throw new Error('Status: ' + response.status);
            }
        } catch (error) {
            console.warn('⚠️ Backend Render offline ou em cold start');
            if (statusText) {
                statusText.textContent = '🟡 Python Iniciando... (Render)';
                statusText.className = '';
            }
        }
    }

    // ========== FUNÇÃO TOGGLE EXPAND ==========
    function toggleExpand(e) {
        if (e) {
            e.stopPropagation();
        }

        const wrapper = document.getElementById('code-editor-wrapper');
        const overlay = document.getElementById('code-overlay');
        const btn = document.querySelector('.btn-expand');

        if (!wrapper) return;

        const isExpanded = wrapper.classList.contains('expanded');

        if (!isExpanded) {
            wrapper.classList.add('expanded');
            if (overlay) overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            if (btn) btn.innerHTML = '⛶ Recolher';
        } else {
            wrapper.classList.remove('expanded');
            if (overlay) overlay.classList.remove('show');
            document.body.style.overflow = '';
            if (btn) btn.innerHTML = '⛶ Expandir';
        }
    }

    // Fechar expandido ao clicar no overlay
    document.addEventListener('click', function(e) {
        const wrapper = document.getElementById('code-editor-wrapper');
        const overlay = document.getElementById('code-overlay');

        if (!wrapper || !wrapper.classList.contains('expanded')) return;
        if (e.target === overlay) {
            toggleExpand();
        }
    });

    // ========== INICIALIZAÇÃO ==========
    document.addEventListener('DOMContentLoaded', function() {
        // Carregar exemplo Hello World por padrão
        const codeTextarea = document.getElementById('code-textarea');
        if (codeTextarea && !codeTextarea.value) {
            codeTextarea.value = examples.hello;
            codeTextarea.dispatchEvent(new Event('input'));
        }

        // Verificar conexão com backend
        checkBackendConnection();
        setInterval(checkBackendConnection, 30000); // A cada 30 segundos

        console.log('✅ Compilador Python carregado!');
        console.log('🔗 Backend:', BACKEND_URL);
        console.log('⌨️  Ctrl+Enter para executar');
        console.log('💡 Cold start pode levar até 50 segundos');
    });

    // ========== EXPORTAÇÃO PARA ESCOPO GLOBAL ==========
    window.compileAndRun = compileAndRun;
    window.loadExample = loadExample;
    window.clearCode = clearCode;
    window.saveCode = saveCode;
    window.toggleExpand = toggleExpand;
    window.pythonExamples = examples;

    console.log('✅ Compilador Python carregado!');
    console.log('🔗 Backend:', BACKEND_URL);
    console.log('⌨️  Ctrl+Enter para executar');
    console.log('💡 Cold start pode levar até 50 segundos');
})();