'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'typescript' | 'python'>('typescript')

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>MCP com Gemini 2.5 Flash</h1>
        <p className={styles.subtitle}>Guia completo para implementação</p>

        <div className={styles.infoBox}>
          <h2>🎯 Resposta Direta</h2>
          <p><strong>MCP (Model Context Protocol)</strong> é um protocolo da Anthropic que atualmente tem suporte oficial em <strong>TypeScript/JavaScript</strong>.</p>
          <p style={{marginTop: '1rem'}}>Para usar MCP com Gemini em Python, você tem <strong>duas opções</strong>:</p>
        </div>

        <div className={styles.options}>
          <div className={styles.option}>
            <h3>✅ Opção 1: TypeScript + Gemini API</h3>
            <p>Use o SDK oficial do MCP em TypeScript/Node.js e chame a API do Gemini</p>
            <ul>
              <li>Suporte completo ao MCP</li>
              <li>Integração direta com servidores MCP</li>
              <li>Melhor performance e estabilidade</li>
            </ul>
          </div>

          <div className={styles.option}>
            <h3>🔧 Opção 2: Python com implementação customizada</h3>
            <p>Crie um cliente MCP em Python (experimental)</p>
            <ul>
              <li>Requer implementação manual do protocolo</li>
              <li>Pode usar bibliotecas como <code>mcp</code> (não oficial)</li>
              <li>Mais complexo de manter</li>
            </ul>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'typescript' ? styles.active : ''}`}
            onClick={() => setActiveTab('typescript')}
          >
            TypeScript (Recomendado)
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'python' ? styles.active : ''}`}
            onClick={() => setActiveTab('python')}
          >
            Python (Experimental)
          </button>
        </div>

        <div className={styles.codeSection}>
          {activeTab === 'typescript' ? (
            <>
              <h3>Implementação com TypeScript</h3>
              <p>Instale as dependências:</p>
              <pre><code>{`npm install @modelcontextprotocol/sdk @google/generative-ai`}</code></pre>

              <p>Código completo:</p>
              <pre><code>{`import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Conectar ao servidor MCP
const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-filesystem", "/caminho/do/projeto"]
});

const mcpClient = new Client({
  name: "gemini-mcp-client",
  version: "1.0.0"
}, {
  capabilities: {}
});

await mcpClient.connect(transport);

// 2. Listar ferramentas disponíveis no MCP
const tools = await mcpClient.listTools();
console.log("Ferramentas MCP:", tools);

// 3. Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 4. Enviar prompt com contexto do MCP
const result = await model.generateContent({
  contents: [{
    role: "user",
    parts: [{ text: "Liste os arquivos no diretório" }]
  }],
  tools: tools.tools.map(tool => ({
    functionDeclarations: [{
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema
    }]
  }))
});

// 5. Processar respostas e executar ferramentas MCP
const response = result.response;
if (response.functionCalls) {
  for (const call of response.functionCalls) {
    const toolResult = await mcpClient.callTool({
      name: call.name,
      arguments: call.args
    });
    console.log("Resultado:", toolResult);
  }
}`}</code></pre>

              <div className={styles.benefits}>
                <h4>✨ Vantagens desta abordagem:</h4>
                <ul>
                  <li>SDK oficial do MCP com todos os recursos</li>
                  <li>Gemini continua sendo seu modelo principal</li>
                  <li>Acesso a todos os servidores MCP da comunidade</li>
                  <li>Tipagem forte com TypeScript</li>
                  <li>Fácil de manter e atualizar</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <h3>Implementação Experimental com Python</h3>
              <p>⚠️ Não há SDK oficial do MCP para Python. Você precisará:</p>

              <div className={styles.warning}>
                <h4>Limitações:</h4>
                <ul>
                  <li>Implementação manual do protocolo MCP</li>
                  <li>Sem garantia de compatibilidade futura</li>
                  <li>Requer manutenção constante</li>
                </ul>
              </div>

              <p>Opção A: Usar biblioteca não-oficial:</p>
              <pre><code>{`# Instalar (biblioteca experimental)
pip install mcp google-generativeai

# Exemplo básico
import google.generativeai as genai
from mcp import MCPClient  # Hipotético - não é oficial

# Conectar ao servidor MCP via stdio
client = MCPClient()
await client.connect({
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/caminho"]
})

# Listar ferramentas
tools = await client.list_tools()

# Configurar Gemini
genai.configure(api_key="SUA_API_KEY")
model = genai.GenerativeModel('gemini-2.5-flash')

# Usar ferramentas
response = model.generate_content(
    "Liste os arquivos",
    tools=[{
        'function_declarations': [{
            'name': tool.name,
            'description': tool.description,
            'parameters': tool.input_schema
        } for tool in tools]
    }]
)

# Executar chamadas de função
for part in response.parts:
    if fn_call := part.function_call:
        result = await client.call_tool(fn_call.name, fn_call.args)
        print(result)`}</code></pre>

              <p>Opção B: Criar bridge TypeScript → Python:</p>
              <pre><code>{`# Criar um servidor Node.js que expõe MCP via HTTP/WebSocket
# e chamar dele no Python

# servidor_mcp.ts (Node.js)
import express from 'express';
import { Client } from '@modelcontextprotocol/sdk/client';

const app = express();
app.post('/mcp/tools', async (req, res) => {
  const tools = await mcpClient.listTools();
  res.json(tools);
});

# cliente.py (Python)
import requests
import google.generativeai as genai

# Buscar ferramentas do servidor bridge
tools_response = requests.post('http://localhost:3000/mcp/tools')
tools = tools_response.json()

# Usar com Gemini
model = genai.GenerativeModel('gemini-2.5-flash')
response = model.generate_content("...", tools=tools)`}</code></pre>
            </>
          )}
        </div>

        <div className={styles.recommendation}>
          <h3>💡 Recomendação Final</h3>
          <p><strong>Use TypeScript/Node.js</strong> para trabalhar com MCP + Gemini.</p>
          <ul>
            <li>✅ Suporte oficial e completo</li>
            <li>✅ Gemini funciona perfeitamente via API</li>
            <li>✅ Ecossistema maduro de servidores MCP</li>
            <li>✅ Melhor experiência de desenvolvimento</li>
          </ul>
          <p style={{marginTop: '1rem', fontStyle: 'italic'}}>
            Você não perde nada do Gemini ao usar TypeScript - apenas chama a API do Google AI da mesma forma!
          </p>
        </div>

        <div className={styles.resources}>
          <h3>📚 Recursos</h3>
          <ul>
            <li><a href="https://modelcontextprotocol.io" target="_blank" rel="noopener">Documentação oficial do MCP</a></li>
            <li><a href="https://ai.google.dev/gemini-api/docs" target="_blank" rel="noopener">Documentação do Gemini API</a></li>
            <li><a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener">Servidores MCP oficiais</a></li>
          </ul>
        </div>
      </div>
    </main>
  )
}
