#!/usr/bin/env node

/**
 * AI Chronicle Query Server
 *
 * A local HTTP server that wraps the C-based md2json and aiquery tools
 * for use with the Chrome extension.
 *
 * Usage: node server.js
 * Server runs on: http://localhost:3777
 */

const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3777;
const TEMP_DIR = path.join(os.tmpdir(), 'ai-chronicle');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Path to C tools (assumes they're compiled in this directory)
const MD2JSON_PATH = path.join(__dirname, 'md2json');
const AIQUERY_PATH = path.join(__dirname, 'aiquery');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Check if C tools exist
function checkTools() {
  const md2jsonExists = fs.existsSync(MD2JSON_PATH);
  const aiqueryExists = fs.existsSync(AIQUERY_PATH);

  return {
    md2json: md2jsonExists,
    aiquery: aiqueryExists,
    ready: md2jsonExists && aiqueryExists
  };
}

// Execute md2json
async function convertMdToJson(mdContent, filename) {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(TEMP_DIR, `${Date.now()}_${filename}`);
    const outputPath = inputPath.replace('.md', '.json');

    // Write MD content to temp file
    fs.writeFileSync(inputPath, mdContent);

    // Run md2json
    const process = spawn(MD2JSON_PATH, [inputPath, outputPath]);

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        try {
          const jsonContent = fs.readFileSync(outputPath, 'utf8');
          const result = JSON.parse(jsonContent);

          // Cleanup
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);

          resolve({
            success: true,
            data: result,
            output: stdout
          });
        } catch (error) {
          reject({
            success: false,
            error: 'Failed to read or parse output JSON',
            details: error.message
          });
        }
      } else {
        reject({
          success: false,
          error: 'Conversion failed',
          stderr: stderr,
          code: code
        });
      }
    });
  });
}

// Execute aiquery
async function searchConversation(searchTerm, jsonData, options = {}) {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(TEMP_DIR, `${Date.now()}_search.json`);
    const { limit = 10, caseSensitive = false } = options;

    // Write JSON data to temp file
    fs.writeFileSync(inputPath, JSON.stringify(jsonData));

    // Build command arguments
    const args = [searchTerm, inputPath];
    if (limit > 0) {
      args.unshift('-l', limit.toString());
    }

    // Run aiquery
    const process = spawn(AIQUERY_PATH, args);

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      // Cleanup
      fs.unlinkSync(inputPath);

      if (code === 0) {
        // Parse aiquery output
        const results = parseAiqueryOutput(stdout);
        resolve({
          success: true,
          results: results,
          raw_output: stdout
        });
      } else {
        reject({
          success: false,
          error: 'Search failed',
          stderr: stderr,
          code: code
        });
      }
    });
  });
}

// Parse aiquery text output into structured results
function parseAiqueryOutput(output) {
  const results = [];
  const lines = output.split('\n');

  let currentResult = null;
  let inResult = false;
  let textLines = [];

  for (const line of lines) {
    if (line.includes('Result #')) {
      // Save previous result
      if (currentResult) {
        currentResult.text = textLines.join('\n').trim();
        results.push(currentResult);
      }

      // Start new result
      const match = line.match(/Result #(\d+)/);
      if (match) {
        currentResult = {
          number: parseInt(match[1]),
          type: null,
          order: null,
          parent: null,
          text: ''
        };
        inResult = true;
        textLines = [];
      }
    } else if (currentResult && line.startsWith('Type:')) {
      currentResult.type = line.replace('Type:', '').trim();
    } else if (currentResult && line.startsWith('Order:')) {
      currentResult.order = parseInt(line.replace('Order:', '').trim());
    } else if (currentResult && line.startsWith('Parent:')) {
      const match = line.match(/Message #(\d+)/);
      if (match) {
        currentResult.parent = parseInt(match[1]);
      }
    } else if (currentResult && line.includes('---')) {
      // Skip separator lines
      continue;
    } else if (currentResult && line.trim()) {
      textLines.push(line);
    }
  }

  // Save last result
  if (currentResult) {
    currentResult.text = textLines.join('\n').trim();
    results.push(currentResult);
  }

  return results;
}

// HTTP request handler
const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health' && req.method === 'GET') {
    const tools = checkTools();
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      status: 'ok',
      tools: tools,
      message: tools.ready ? 'Server ready' : 'C tools not found'
    }));
    return;
  }

  // Convert MD to JSON
  if (req.url === '/convert' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const { content, filename } = JSON.parse(body);

        if (!content || !filename) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({ error: 'Missing content or filename' }));
          return;
        }

        const result = await convertMdToJson(content, filename);
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ error: error.message || error }));
      }
    });
    return;
  }

  // Search conversations
  if (req.url === '/search' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const { searchTerm, jsonData, options } = JSON.parse(body);

        if (!searchTerm || !jsonData) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({ error: 'Missing searchTerm or jsonData' }));
          return;
        }

        const result = await searchConversation(searchTerm, jsonData, options);
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ error: error.message || error }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404, corsHeaders);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀  AI Chronicle Query Server');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log('');

  const tools = checkTools();
  if (tools.ready) {
    console.log('✅  C tools found and ready:');
    console.log(`    • md2json: ${MD2JSON_PATH}`);
    console.log(`    • aiquery: ${AIQUERY_PATH}`);
  } else {
    console.log('⚠️  Warning: C tools not found!');
    if (!tools.md2json) console.log(`    ✗ md2json missing: ${MD2JSON_PATH}`);
    if (!tools.aiquery) console.log(`    ✗ aiquery missing: ${AIQUERY_PATH}`);
    console.log('');
    console.log('To fix:');
    console.log('  1. cd /home/rich/productions/coding_in_C/c_query_system');
    console.log('  2. make');
    console.log(`  3. cp md2json aiquery ${__dirname}/`);
  }

  console.log('');
  console.log('Endpoints:');
  console.log('  GET  /health   - Check server status');
  console.log('  POST /convert  - Convert MD to JSON');
  console.log('  POST /search   - Search conversations');
  console.log('═══════════════════════════════════════════════════════');
});