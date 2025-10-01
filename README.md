# AI Chronicle Toolkit

> **Professional-grade command-line tools for searching and analyzing your AI conversations locally with native-level performance.**

High-performance C-based tools for processing and querying AI conversation exports from the [AI Chronicle browser extension](https://github.com/quantum-encoding/chrome-scribe-edition).

**Built by:** [Quantum Encoding Ltd](https://www.quantumencoding.io)
**License:** MIT

---

## 🚀 What is this?

The AI Chronicle Toolkit is a suite of professional command-line tools designed for **power users** who want to:

- ✅ **Search** massive AI conversation archives at **native speed**
- ✅ **Convert** markdown exports to structured JSON for programmatic analysis
- ✅ **Query** locally with **privacy** - your data never leaves your machine
- ✅ **Integrate** with custom scripts, workflows, and analysis pipelines

### Tools Included

1. **`md2json`** - High-performance C binary for converting AI Chronicle markdown exports to structured JSON
2. **`aiquery`** - Lightning-fast C binary for searching conversations with fuzzy matching and context
3. **`server.js`** - Optional Node.js HTTP server that wraps the C tools for browser extension integration

---

## 📦 Installation

### Prerequisites

- **macOS / Linux** (Windows support via WSL)
- **Node.js 14+** (for optional server)
- **C compiler** (gcc or clang) - if compiling from source

### Option 1: Download Pre-compiled Binaries (Recommended)

```bash
# Download the latest release
wget https://github.com/quantum-encoding/ai-chronicle-toolkit/releases/latest/download/ai-chronicle-toolkit.tar.gz

# Extract
tar -xzf ai-chronicle-toolkit.tar.gz
cd ai-chronicle-toolkit

# Make binaries executable
chmod +x md2json aiquery

# Test
./md2json --version
./aiquery --version
```

### Option 2: Compile from Source

See [INSTALL.md](INSTALL.md) for detailed compilation instructions.

---

## 🎯 Quick Start

### Convert Markdown to JSON

```bash
# Convert a single conversation
./md2json conversation.md > conversation.json

# Batch convert all conversations
for file in *.md; do
  ./md2json "$file" > "${file%.md}.json"
done
```

### Search Conversations

```bash
# Search for a term
./aiquery "DPDK" conversation.json

# Search with options
./aiquery --case-sensitive --limit 20 "knowledge graph" *.json

# Output as JSON
./aiquery --json "architecture" conversation.json
```

### Run the HTTP Server (Optional)

For browser extension integration:

```bash
# Install dependencies (one-time)
npm install

# Start server
node server.js

# Server runs on http://localhost:3777
```

---

## 📖 Usage Examples

### Example 1: Find all mentions of "neural networks"

```bash
./aiquery "neural networks" my-ai-conversations/*.json
```

**Output:**
```
📁 conversation-2025-10-01.json
  [Message #5] User: "Can you explain how neural networks work?"
  [Message #6] AI: "Neural networks are computational models inspired by..."

📁 deep-learning-2025-09-28.json
  [Message #12] AI: "Advanced neural networks like transformers..."
```

### Example 2: Convert and search in one pipeline

```bash
./md2json conversation.md | ./aiquery --json "quantum computing" -
```

### Example 3: Integrate with scripts

```python
import subprocess
import json

# Convert MD to JSON
result = subprocess.run(['./md2json', 'conversation.md'],
                       capture_output=True, text=True)
data = json.loads(result.stdout)

# Analyze programmatically
for message in data['messages']:
    if 'code' in message['content']:
        print(f"Found code in message {message['id']}")
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│  AI Chronicle Extension         │
│  (Chrome Browser)               │
└───────────────┬─────────────────┘
                │ Exports .md files
                ▼
┌─────────────────────────────────┐
│  Your Local Downloads Folder    │
└───────────────┬─────────────────┘
                │
                ├─► md2json ──► conversation.json
                │
                └─► aiquery ──► search results
```

**For Extension Integration (Optional):**
```
Extension ──HTTP──► server.js ──spawn()──► C Tools
```

---

## 🔧 Command Reference

### `md2json`

Convert AI Chronicle markdown exports to structured JSON.

```bash
md2json [OPTIONS] <input.md>

Options:
  --pretty      Pretty-print JSON output
  --validate    Validate structure before output
  --version     Show version
  --help        Show help
```

### `aiquery`

Search AI conversations with context.

```bash
aiquery [OPTIONS] <search-term> <files...>

Options:
  --limit N            Max results per file (default: 10)
  --case-sensitive     Case-sensitive search
  --json               Output as JSON
  --context N          Lines of context (default: 2)
  --files-only         Show only filenames
  --version            Show version
  --help               Show help
```

### `server.js`

HTTP server for browser extension integration.

```bash
node server.js [OPTIONS]

Options:
  --port N        Port number (default: 3777)
  --verbose       Verbose logging

Endpoints:
  GET  /health    Server status
  POST /convert   MD → JSON conversion
  POST /search    Search conversations
```

---

## 🔒 Privacy & Security

- ✅ **100% Local** - All processing happens on your machine
- ✅ **No Network** - Tools don't make external requests
- ✅ **No Telemetry** - Zero data collection
- ✅ **Open Source** - Audit the code yourself

Your conversations stay on your machine. Period.

---

## 📊 Performance

Benchmarked on M1 MacBook Pro:

| Operation | File Size | Time |
|-----------|-----------|------|
| `md2json` conversion | 1 MB | ~50ms |
| `md2json` conversion | 10 MB | ~400ms |
| `aiquery` search | 100 conversations | ~200ms |
| `aiquery` search | 1000 conversations | ~1.5s |

**Designed for speed.** Written in C with zero-copy parsing and efficient memory management.

---

## 🐛 Troubleshooting

### Tools not found

```bash
# Make sure binaries are executable
chmod +x md2json aiquery

# Check they're in your PATH or use ./
./md2json --version
```

### Server won't start

```bash
# Install dependencies
npm install

# Check port availability
lsof -i :3777

# Try different port
node server.js --port 3778
```

### Compilation errors

See [INSTALL.md](INSTALL.md) for platform-specific compilation guides.

---

## 🤝 Contributing

Contributions welcome! This toolkit is designed to be:

- **Fast** - Optimized C code
- **Simple** - Single-file binaries
- **Portable** - Works on macOS, Linux, WSL
- **Extensible** - Easy to add new features

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📝 License

MIT © 2025 [Quantum Encoding Ltd](https://www.quantumencoding.io)

---

## 🔗 Links

- **AI Chronicle Extension:** https://github.com/quantum-encoding/chrome-scribe-edition
- **Company Website:** https://www.quantumencoding.io
- **Support:** info@quantumencoding.io

---

**Made with 🤍 by Quantum Encoding Ltd**
*AI Workflow Services*
