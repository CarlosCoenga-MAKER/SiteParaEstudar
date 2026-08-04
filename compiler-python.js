// compiler-python.js - Compilador Python Online
(function() {
    'use strict';

    // ✅ MESMA URL DO BACKEND (UNIFICADO)
    const BACKEND_URL = 'https://siteparaestudar.onrender.com';

    // Exemplos de código Python
    const pythonExamples = {
        hello: `# Hello World em Python
print("Hello, World!")
print("SiteParaEstudar © 2026")

# Exemplo de variáveis
nome = "Python"
ano = 1991
print(f"Linguagem: {nome} - Criada em {ano}")`,

        menorNumero: `# Encontrar o menor número
def encontrar_menor(numeros):
    if not numeros:
        return None
    menor = numeros[0]
    for num in numeros:
        if num < menor:
            menor = num
    return menor

print("Digite números (digite 'fim' para parar):")
numeros = []
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
    print(f"\\nO menor número digitado foi: {menor}")
    print(f"Lista completa: {numeros}")
else:
    print("Nenhum número foi digitado.")`,

        calculadora: `# Calculadora simples
def calculadora():
    print("=== CALCULADORA PYTHON ===")
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

try:
    num = int(input("Digite um número para calcular o fatorial: "))
    resultado = fatorial(num)
    if resultado is None:
        print("Não existe fatorial de número negativo!")
    else:
        print(f"O fatorial de {num} é: {resultado}")
        print(f"\\nCálculo: {num}! = ", end="")
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

try:
    num = int(input("Digite um número para ver a tabuada: "))
    tabuada(num)
    
    opcao = input("\\nDeseja ver até um número específico? (s/n): ").lower()
    if opcao == 's':
        ate = int(input("Até qual número? "))
        tabuada(num, ate)
except ValueError:
    print("Por favor, digite um número inteiro válido!")`
    };

    /**
     * Executa o código Python via backend
     */
    async function pythonCompileAndRun() {
        const codeArea = document.getElementById('code-area');
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-area');
        const runBtn = document.getElementById('run-btn');
        const spinner = document.getElementById('spinner');
        const statusText = document.getElementById('status-text');

        if (!codeArea || !outputArea) {
            console.error('❌ Elementos da interface não encontrados!');
            return;
        }

        const code = codeArea.value.trim();
        const input = inputArea ? inputArea.value : '';

        if (!code) {
            outputArea.textContent = '⚠️ Digite um código Python!';
            return;
        }

        // Ativa estado de loading
        if (runBtn) runBtn.disabled = true;
        if (spinner) spinner.style.display = 'inline-block';
        outputArea.textContent = '🔄 Executando Python (Render)...\n⏳ Aguarde a resposta do servidor...\n\n💡 Dica: O Render pode demorar até 50 segundos\npara iniciar se estiver em cold start.';
        if (statusText) {
            statusText.textContent = '⏳ Executando...';
            statusText.style.color = '#fadc6d';
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            // ⚠️ ROTA DIFERENTE: /execute (Python) em vez de /compilar (C)
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
                output += result.error + '\n';
            }

            // Saída do programa
            if (result.output) {
                if (result.error) output += '\n';
                output += '══════════════════════\n';
                output += '  📤 SAÍDA:\n';
                output += '══════════════════════\n\n';
                output += result.output;
            }

            // Caso não tenha saída nem erro
            if (!result.output && !result.error) {
                output = '✅ Programa executado com sucesso!\n(Sem saída de texto)';
            }

            outputArea.textContent = output;

            if (statusText) {
                statusText.textContent = result.success ? '✅ Python: Sucesso!' : '❌ Python: Erro na execução';
                statusText.style.color = result.success ? '#2ecc71' : '#e74c3c';
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

            if (statusText) {
                statusText.textContent = '❌ Erro de conexão';
                statusText.style.color = '#e74c3c';
            }
        } finally {
            if (runBtn) runBtn.disabled = false;
            if (spinner) spinner.style.display = 'none';
        }
    }

    /**
     * Carrega um exemplo de código Python
     */
    function loadPythonExample(name) {
        const codeArea = document.getElementById('code-area');
        const outputArea = document.getElementById('output-area');
        const statusText = document.getElementById('status-text');

        if (!codeArea) return;

        if (pythonExamples[name]) {
            codeArea.value = pythonExamples[name];

            // Define inputs para cada exemplo Python
            const inputArea = document.getElementById('input-area');
            if (inputArea) {
                const inputs = {
                    menorNumero: '45\n23\n67\n12\n89\nfim',
                    fatorial: '5',
                    calculadora: '5\n+\n3',
                    tabuada: '7'
                };
                inputArea.value = inputs[name] || '';
            }

            if (outputArea) outputArea.textContent = '✅ Exemplo Python carregado! Ctrl+Enter para executar.\n\n📝 Código pronto. Clique em "Executar" ou\npressione Ctrl+Enter para rodar no servidor Render.';
            if (statusText) {
                statusText.textContent = '📝 Python: ' + name;
                statusText.style.color = '#fadc6d';
            }
        }
    }

    /**
     * Limpa o editor e áreas
     */
    function clearPythonCode() {
        const codeArea = document.getElementById('code-area');
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-area');
        const statusText = document.getElementById('status-text');

        if (codeArea) codeArea.value = '';
        if (inputArea) inputArea.value = '';
        if (outputArea) outputArea.textContent = '# Digite seu código Python e pressione Ctrl+Enter';
        if (statusText) {
            statusText.textContent = 'Pronto';
            statusText.style.color = '#7878a0';
        }
    }

    // ========== EXPORTAÇÃO PARA ESCOPO GLOBAL ==========
    window.pythonCompileAndRun = pythonCompileAndRun;
    window.loadPythonExample = loadPythonExample;
    window.clearPythonCode = clearPythonCode;
    window.pythonExamples = pythonExamples;

    console.log('✅ Compilador Python carregado!');
    console.log('🔗 Backend:', BACKEND_URL);
    console.log('⌨️  Ctrl+Enter para executar');
    console.log('💡 Cold start pode levar até 50 segundos');
})();