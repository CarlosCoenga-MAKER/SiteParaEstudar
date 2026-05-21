// ==============================================================
// Mate.js - Compilador de Demonstrações Lógicas
// ==============================================================

class LogicCompiler {
    constructor() {
        // Mapeamento de conectivos lógicos
        this.operators = {
            '∧': '∧', '∧': '∧', '∧': '∧', 'and': '∧', 'e': '∧',
            '∨': '∨', '∨': '∨', '∨': '∨', 'or': '∨', 'ou': '∨',
            '¬': '¬', '¬': '¬', '~': '¬', 'not': '¬', 'não': '¬', 'nao': '¬',
            '→': '→', '->': '→', '->': '→', '→': '→', '→': '→',
            '↔': '↔', '<->': '↔', '<->': '↔', '↔': '↔', '↔': '↔',
            '<-': '←', '<-': '←'
        };
        
        // Premissas atuais da demonstração
        this.premises = new Set();
        this.provenLines = new Map(); // número da linha -> fórmula
        this.hypotheticalContext = []; // Stack de contextos hipotéticos
    }

    // Normaliza conectivos para representação interna
    normalizeFormula(formula) {
        let normalized = formula.replace(/\s+/g, ' ').trim();
        for (let [key, value] of Object.entries(this.operators)) {
            const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            normalized = normalized.replace(new RegExp(escaped, 'gi'), value);
        }
        return normalized;
    }

    // Parser de fórmulas (simplificado)
    parseFormula(formula) {
        const normalized = this.normalizeFormula(formula);
        const tokens = this.tokenize(normalized);
        return this.parseTokens(tokens);
    }

    tokenize(formula) {
        const regex = /[A-Za-z]+|∧|∨|¬|→|↔|←|\(|\)|⊤|⊥/g;
        return formula.match(regex) || [];
    }

    parseTokens(tokens) {
        let pos = 0;
        
        const parseExpression = () => {
            let left = parseTerm();
            
            while (pos < tokens.length && ['→', '↔', '←', '∧', '∨'].includes(tokens[pos])) {
                const op = tokens[pos++];
                const right = parseTerm();
                left = { type: 'binary', operator: op, left, right };
            }
            
            return left;
        };
        
        const parseTerm = () => {
            if (tokens[pos] === '¬') {
                pos++;
                return { type: 'unary', operator: '¬', operand: parseTerm() };
            }
            
            if (tokens[pos] === '(') {
                pos++; // skip '('
                const expr = parseExpression();
                if (tokens[pos] === ')') pos++; // skip ')'
                return expr;
            }
            
            if (tokens[pos] === '⊤') { pos++; return { type: 'constant', value: true }; }
            if (tokens[pos] === '⊥') { pos++; return { type: 'constant', value: false }; }
            
            const atom = tokens[pos++];
            return { type: 'atom', name: atom };
        };
        
        return parseExpression();
    }

    // Verifica se uma regra de inferência foi aplicada corretamente
    verifyRule(ruleName, premises, conclusion, lineNumbers) {
        const rule = ruleName.toUpperCase().replace(/\s+/g, '');
        
        const rules = {
            'MP': () => this.verifyModusPonens(premises, conclusion),
            'MODUSPONENS': () => this.verifyModusPonens(premises, conclusion),
            'MT': () => this.verifyModusTollens(premises, conclusion),
            'MODUSTOLLENS': () => this.verifyModusTollens(premises, conclusion),
            '∧E': () => this.verifyConjunctionElim(premises, conclusion),
            'CONJUNCTIONELIM': () => this.verifyConjunctionElim(premises, conclusion),
            '∧I': () => this.verifyConjunctionIntro(premises, conclusion),
            'CONJUNCTIONINTRO': () => this.verifyConjunctionIntro(premises, conclusion),
            '∨I': () => this.verifyDisjunctionIntro(premises, conclusion),
            'DISJUNCTIONINTRO': () => this.verifyDisjunctionIntro(premises, conclusion),
            '∨E': () => this.verifyDisjunctionElim(premises, conclusion, lineNumbers),
            'DISJUNCTIONELIM': () => this.verifyDisjunctionElim(premises, conclusion, lineNumbers),
            '→I': () => this.verifyImplicationIntro(premises, conclusion),
            'IMPLICATIONINTRO': () => this.verifyImplicationIntro(premises, conclusion),
            '¬I': () => this.verifyNegationIntro(premises, conclusion, lineNumbers),
            'NEGATIONINTRO': () => this.verifyNegationIntro(premises, conclusion, lineNumbers),
            '¬E': () => this.verifyNegationElim(premises, conclusion),
            'NEGATIONELIM': () => this.verifyNegationElim(premises, conclusion),
            '↔I': () => this.verifyBiconditionalIntro(premises, conclusion),
            'BICONDITIONALINTRO': () => this.verifyBiconditionalIntro(premises, conclusion),
            '↔E': () => this.verifyBiconditionalElim(premises, conclusion),
            'BICONDITIONALELIM': () => this.verifyBiconditionalElim(premises, conclusion),
            'ABS': () => this.verifyAbsurdity(premises, conclusion),
            'ABSURDITY': () => this.verifyAbsurdity(premises, conclusion),
        };
        
        if (rules[rule]) {
            return rules[rule]();
        }
        
        return { valid: false, error: `Regra "${ruleName}" não reconhecida` };
    }

    // Verifica Modus Ponens: P → Q, P ⊢ Q
    verifyModusPonens(premises, conclusion) {
        if (premises.length < 2) {
            return { valid: false, error: 'MP requer 2 premissas: P → Q e P' };
        }
        
        let implication = null;
        let antecedent = null;
        
        for (const prem of premises) {
            if (prem.type === 'binary' && prem.operator === '→') {
                implication = prem;
            } else {
                antecedent = prem;
            }
        }
        
        if (!implication) {
            return { valid: false, error: 'Nenhuma implicação encontrada nas premissas' };
        }
        
        if (!this.formulasEqual(implication.left, antecedent)) {
            return { valid: false, error: 'O antecedente não corresponde à premissa menor' };
        }
        
        if (!this.formulasEqual(implication.right, conclusion)) {
            return { valid: false, error: 'A conclusão não corresponde ao consequente da implicação' };
        }
        
        return { valid: true, message: 'Modus Ponens aplicado corretamente' };
    }

    // Verifica Modus Tollens: P → Q, ¬Q ⊢ ¬P
    verifyModusTollens(premises, conclusion) {
        if (premises.length < 2) {
            return { valid: false, error: 'MT requer 2 premissas: P → Q e ¬Q' };
        }
        
        let implication = null;
        let negConsequent = null;
        
        for (const prem of premises) {
            if (prem.type === 'binary' && prem.operator === '→') {
                implication = prem;
            } else if (prem.type === 'unary' && prem.operator === '¬') {
                negConsequent = prem;
            }
        }
        
        if (!implication || !negConsequent) {
            return { valid: false, error: 'Estrutura incorreta para MT' };
        }
        
        if (!this.formulasEqual(implication.right, negConsequent.operand)) {
            return { valid: false, error: '¬Q não corresponde ao consequente da implicação' };
        }
        
        if (conclusion.type !== 'unary' || conclusion.operator !== '¬' || 
            !this.formulasEqual(conclusion.operand, implication.left)) {
            return { valid: false, error: 'Conclusão deve ser ¬P' };
        }
        
        return { valid: true, message: 'Modus Tollens aplicado corretamente' };
    }

    // Verifica Eliminação da Conjunção: P ∧ Q ⊢ P (ou Q)
    verifyConjunctionElim(premises, conclusion) {
        if (premises.length !== 1) {
            return { valid: false, error: '∧E requer 1 premissa: P ∧ Q' };
        }
        
        const prem = premises[0];
        if (prem.type !== 'binary' || prem.operator !== '∧') {
            return { valid: false, error: 'Premissa não é uma conjunção' };
        }
        
        if (!this.formulasEqual(prem.left, conclusion) && 
            !this.formulasEqual(prem.right, conclusion)) {
            return { valid: false, error: 'Conclusão não é parte da conjunção' };
        }
        
        return { valid: true, message: 'Eliminação da conjunção aplicada corretamente' };
    }

    // Verifica Introdução da Conjunção: P, Q ⊢ P ∧ Q
    verifyConjunctionIntro(premises, conclusion) {
        if (premises.length < 2) {
            return { valid: false, error: '∧I requer 2 premissas: P e Q' };
        }
        
        if (conclusion.type !== 'binary' || conclusion.operator !== '∧') {
            return { valid: false, error: 'Conclusão não é uma conjunção' };
        }
        
        const leftMatch = premises.some(p => this.formulasEqual(p, conclusion.left));
        const rightMatch = premises.some(p => this.formulasEqual(p, conclusion.right));
        
        if (!leftMatch || !rightMatch) {
            return { valid: false, error: 'Premissas não correspondem aos componentes da conjunção' };
        }
        
        return { valid: true, message: 'Introdução da conjunção aplicada corretamente' };
    }

    // Verifica Introdução da Disjunção: P ⊢ P ∨ Q
    verifyDisjunctionIntro(premises, conclusion) {
        if (premises.length !== 1) {
            return { valid: false, error: '∨I requer 1 premissa' };
        }
        
        if (conclusion.type !== 'binary' || conclusion.operator !== '∨') {
            return { valid: false, error: 'Conclusão não é uma disjunção' };
        }
        
        if (!this.formulasEqual(premises[0], conclusion.left) && 
            !this.formulasEqual(premises[0], conclusion.right)) {
            return { valid: false, error: 'Premissa não corresponde a nenhum disjunto' };
        }
        
        return { valid: true, message: 'Introdução da disjunção aplicada corretamente' };
    }

    // Compara duas fórmulas por estrutura
    formulasEqual(f1, f2) {
        if (!f1 || !f2) return false;
        if (f1.type !== f2.type) return false;
        
        if (f1.type === 'atom') return f1.name === f2.name;
        if (f1.type === 'constant') return f1.value === f2.value;
        if (f1.type === 'unary') {
            return f1.operator === f2.operator && this.formulasEqual(f1.operand, f2.operand);
        }
        if (f1.type === 'binary') {
            return f1.operator === f2.operator && 
                   this.formulasEqual(f1.left, f2.left) && 
                   this.formulasEqual(f1.right, f2.right);
        }
        
        return false;
    }

    // Parse de uma linha de demonstração
    parseDemonstrationLine(line) {
        // Padrões: "N. FÓRMULA (REGRA LINHAS)" ou "N. FÓRMULA (Premissa)"
        const regex = /^(\d+)\.\s+(.+?)\s*(?:\((.+)\))?$/;
        const match = line.match(regex);
        
        if (!match) {
            return { error: 'Formato inválido. Use: N. FÓRMULA (REGRA LINHAS)' };
        }
        
        return {
            number: parseInt(match[1]),
            formula: match[2].trim(),
            justification: match[3] ? match[3].trim() : ''
        };
    }

    // Compila e verifica uma demonstração completa
    compileDemonstration(demonstration, premisesList) {
        this.premises = new Set(premisesList.map(p => this.normalizeFormula(p)));
        this.provenLines = new Map();
        
        const lines = demonstration.split('\n').filter(l => l.trim());
        const results = [];
        let allValid = true;
        
        for (let i = 0; i < lines.length; i++) {
            const parsed = this.parseDemonstrationLine(lines[i]);
            
            if (parsed.error) {
                results.push({ line: i + 1, valid: false, error: parsed.error });
                allValid = false;
                continue;
            }
            
            let justification = parsed.justification;
            let formula = this.parseFormula(parsed.formula);
            
            // Verificar se é premissa
            if (justification.toLowerCase().includes('prem') || 
                justification.toLowerCase().includes('premissa')) {
                if (this.premises.has(this.normalizeFormula(parsed.formula))) {
                    this.provenLines.set(parsed.number, formula);
                    results.push({ 
                        line: parsed.number, 
                        valid: true, 
                        message: 'Premissa aceita',
                        formula: parsed.formula
                    });
                } else {
                    results.push({ 
                        line: parsed.number, 
                        valid: false, 
                        error: `"${parsed.formula}" não está nas premissas fornecidas`,
                        formula: parsed.formula
                    });
                    allValid = false;
                }
                continue;
            }
            
            // Parse da justificativa: REGRA n1, n2, ...
            const justParts = justification.split(/\s+/);
            const ruleName = justParts[0];
            const refLines = justParts.slice(1).map(l => parseInt(l)).filter(n => !isNaN(n));
            
            if (!ruleName) {
                results.push({ 
                    line: parsed.number, 
                    valid: false, 
                    error: 'Justificativa ausente',
                    formula: parsed.formula
                });
                allValid = false;
                continue;
            }
            
            // Obter premissas referenciadas
            const referencedFormulas = refLines
                .map(n => this.provenLines.get(n))
                .filter(f => f !== undefined);
            
            if (referencedFormulas.length !== refLines.length) {
                results.push({ 
                    line: parsed.number, 
                    valid: false, 
                    error: 'Linhas de referência não encontradas',
                    formula: parsed.formula
                });
                allValid = false;
                continue;
            }
            
            // Verificar regra
            const verification = this.verifyRule(ruleName, referencedFormulas, formula, refLines);
            
            if (verification.valid) {
                this.provenLines.set(parsed.number, formula);
            } else {
                allValid = false;
            }
            
            results.push({
                line: parsed.number,
                valid: verification.valid,
                message: verification.message || verification.error,
                formula: parsed.formula,
                rule: ruleName,
                references: refLines
            });
        }
        
        return {
            valid: allValid,
            steps: results,
            totalSteps: results.length,
            validSteps: results.filter(r => r.valid).length
        };
    }
}

// ==============================================================
// Interface de Compilação Integrada
// ==============================================================

function compilarDemonstracao(questaoId) {
    const compiler = new LogicCompiler();
    const resposta = savedAnswers[questaoId] || '';
    const questao = QUESTOES.find(q => q.id === questaoId);
    
    if (!resposta.trim()) {
        return { error: 'Nenhuma demonstração fornecida' };
    }
    
    // Extrair premissas da expressão
    const exprParts = questao.expr.split('|-');
    const premisesStr = exprParts[0].trim();
    const premises = premisesStr.split(',').map(p => p.trim());
    
    // Compilar
    const result = compiler.compileDemonstration(resposta, premises);
    
    return {
        ...result,
        questao: questao.expr,
        premises,
        conclusion: exprParts[1] ? exprParts[1].trim() : ''
    };
}

// Função para exibir resultado da compilação
function exibirResultadoCompilacao(resultado, questaoId) {
    const resultBox = document.getElementById('result-' + questaoId);
    
    if (resultado.error) {
        resultBox.className = 'result-box fail show';
        resultBox.innerHTML = `<strong>✗ Erro: ${resultado.error}</strong>`;
        return;
    }
    
    let html = '';
    
    if (resultado.valid) {
        html += '<div style="color: #10b981;"><strong>✓ Demonstração VÁLIDA!</strong></div>';
    } else {
        html += '<div style="color: #ef4444;"><strong>✗ Demonstração INVÁLIDA</strong></div>';
    }
    
    html += `<div style="margin-top: 10px;">Passos: ${resultado.validSteps}/${resultado.totalSteps} válidos</div>`;
    html += '<div style="margin-top: 10px; max-height: 200px; overflow-y: auto;">';
    
    resultado.steps.forEach(step => {
        const color = step.valid ? '#10b981' : '#ef4444';
        const icon = step.valid ? '✓' : '✗';
        html += `<div style="color: ${color}; margin: 5px 0;">${icon} Linha ${step.line}: ${step.formula} - ${step.message}</div>`;
    });
    
    html += '</div>';
    
    resultBox.className = 'result-box ' + (resultado.valid ? 'success' : 'fail') + ' show';
    resultBox.innerHTML = html;
}

// ==============================================================
// Modificar a função verificarQuestao para usar o compilador
// ==============================================================

const verificarQuestaoOriginal = verificarQuestao;

verificarQuestao = function(id) {
    const resultado = compilarDemonstracao(id);
    exibirResultadoCompilacao(resultado, id);
    
    // Atualizar status baseado na compilação
    if (!resultado.error) {
        verifiedStatus[id] = resultado.valid ? 'correct' : 'wrong';
    }
    
    persistAll();
    updateStats();
    renderNavButtons();
    renderCurrentQuest();
};