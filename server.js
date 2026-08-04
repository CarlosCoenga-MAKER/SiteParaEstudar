// server.js - Backend para C e Python no mesmo servidor
const express = require('express');
const cors = require('cors');
const { exec, execSync, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== CONFIGURAÇÃO ==========
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));
app.use(express.json({ limit: '2mb' }));

// ========== ROTA DE HEALTH CHECK ==========
app.get('/ping', (req, res) => {
    // Verifica GCC
    let gccVersion = 'unknown';
    try {
        gccVersion = execSync('gcc --version', { encoding: 'utf8', timeout: 3000 }).split('\n')[0];
    } catch (e) {
        gccVersion = 'GCC não encontrado';
    }

    // Verifica Python
    let pythonVersion = 'unknown';
    try {
        pythonVersion = execSync('python3 --version', { encoding: 'utf8', timeout: 3000 }).trim();
    } catch (e) {
        pythonVersion = 'Python não encontrado';
    }

    res.json({
        status: 'online',
        platform: 'Render',
        gcc: gccVersion,
        python: pythonVersion,
        node: process.version,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// ========== ROTA PARA COMPILAR C ==========
app.post('/compilar', async (req, res) => {
    console.log('📝 [C] Nova requisição de compilação');
    
    const { code, input } = req.body;
    
    if (!code || typeof code !== 'string') {
        return res.status(400).json({ 
            error: 'Código C não fornecido', 
            output: '', 
            success: false 
        });
    }
    
    const tmpDir = path.join('/tmp', `c_${Date.now()}_${Math.random().toString(36).substring(7)}`);
    
    try {
        fs.mkdirSync(tmpDir, { recursive: true });
        const sourceFile = path.join(tmpDir, 'program.c');
        const binaryFile = path.join(tmpDir, 'program');
        fs.writeFileSync(sourceFile, code, 'utf8');
        
        // COMPILA C
        let compileError = null;
        try {
            execSync(`gcc "${sourceFile}" -o "${binaryFile}" -lm -Wall -O2`, {
                encoding: 'utf8',
                timeout: 10000,
                stdio: 'pipe'
            });
        } catch (error) {
            compileError = error.stderr || error.message || 'Erro de compilação';
            compileError = compileError.replace(new RegExp(tmpDir + '/', 'g'), '');
            
            try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
            
            return res.json({
                error: compileError,
                output: '',
                success: false,
                compiled: false
            });
        }
        
        // EXECUTA C
        let output = '';
        let execError = null;
        try {
            output = execFileSync(binaryFile, [], {
                encoding: 'utf8',
                timeout: 5000,
                maxBuffer: 1024 * 1024,
                input: input || '',
                env: { ...process.env, LANG: 'C.UTF-8' }
            });
        } catch (error) {
            output = error.stdout || '';
            execError = error.stderr || (error.killed ? 'Timeout (5s)' : 'Erro de execução');
        }
        
        // LIMPA
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
        
        res.json({
            error: execError || '',
            output: output || '',
            success: !execError && !compileError,
            compiled: !compileError,
            executed: !execError
        });
        
    } catch (error) {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
        res.status(500).json({
            error: 'Erro interno: ' + error.message,
            output: '',
            success: false
        });
    }
});

// ========== ROTA PARA EXECUTAR PYTHON ==========
app.post('/execute', async (req, res) => {
    console.log('📝 [Python] Nova requisição de execução');
    
    const { code, input } = req.body;
    
    if (!code || typeof code !== 'string') {
        return res.status(400).json({
            error: 'Código Python não fornecido',
            output: '',
            success: false
        });
    }
    
    const tmpDir = path.join('/tmp', `python_${Date.now()}`);
    const pythonFile = path.join(tmpDir, 'script.py');
    
    try {
        fs.mkdirSync(tmpDir, { recursive: true });
        fs.writeFileSync(pythonFile, code, 'utf8');
        
        // EXECUTA PYTHON
        let output = '';
        let error = '';
        let killed = false;
        
        try {
            const result = await new Promise((resolve, reject) => {
                const process = exec(
                    `python3 "${pythonFile}"`,
                    {
                        timeout: 10000,
                        maxBuffer: 1024 * 1024
                    },
                    (err, stdout, stderr) => {
                        resolve({ stdout, stderr, err });
                    }
                );
                
                if (input) {
                    process.stdin.write(input);
                    process.stdin.end();
                }
            });
            
            output = result.stdout || '';
            error = result.stderr || '';
            killed = result.err?.killed || false;
            
        } catch (err) {
            error = err.message || 'Erro de execução';
        }
        
        // LIMPA
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
        
        res.json({
            output: output,
            error: error || null,
            success: !error && !killed
        });
        
    } catch (error) {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
        res.status(500).json({
            error: 'Erro interno: ' + error.message,
            output: '',
            success: false
        });
    }
});

// ========== ROTA 404 ==========
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Rota não encontrada',
        endpoints: {
            GET: '/ping - Health check',
            POST: '/compilar - Compilar C',
            POST: '/execute - Executar Python'
        }
    });
});

// ========== INICIAR SERVIDOR ==========
app.listen(PORT, '0.0.0.0', () => {
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   🚀 Servidor Unificado C + Python v2.0        ║');
    console.log(`║   🔌 Porta: ${PORT}                              ║`);
    console.log('║   📝 Endpoints:                                ║');
    console.log('║     GET  /ping     - Health Check              ║');
    console.log('║     POST /compilar - Compilar C                ║');
    console.log('║     POST /execute  - Executar Python           ║');
    console.log('╚══════════════════════════════════════════════════╝');
    
    // Verificar GCC
    try {
        const gcc = execSync('gcc --version', { encoding: 'utf8', timeout: 5000 });
        console.log('✅ GCC:', gcc.split('\n')[0]);
    } catch (e) {
        console.log('❌ GCC não encontrado!');
    }
    
    // Verificar Python
    try {
        const python = execSync('python3 --version', { encoding: 'utf8', timeout: 5000 });
        console.log('✅ Python:', python.trim());
    } catch (e) {
        console.log('❌ Python não encontrado!');
    }
});