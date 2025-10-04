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
2. **`md2json_batch`** - Batch converter for processing entire directories of markdown files
3. **`aiquery`** - Lightning-fast C binary for searching conversations with fuzzy matching and context
4. **`aiquery_batch`** - Batch search tool for querying multiple files with optional Markdown report export

---

## 📦 Installation

### Prerequisites

- **macOS / Linux** (Windows support via WSL)
- **C compiler** (gcc or clang) - if compiling from source

### Option 1: Download Pre-compiled Binaries (Recommended)

```bash
# Download the latest release
wget https://github.com/quantum-encoding/ai-chronicle-toolkit/releases/latest/download/ai-chronicle-toolkit.tar.gz

# Extract
tar -xzf ai-chronicle-toolkit.tar.gz
cd ai-chronicle-toolkit

# Make binaries executable
chmod +x md2json md2json_batch aiquery aiquery_batch

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

# Batch convert entire directory
./md2json_batch my_conversations/

# Batch convert all conversations (manual loop)
for file in *.md; do
  ./md2json "$file" > "${file%.md}.json"
done
```

### Search Conversations

```bash
# Search a single file
./aiquery "DPDK" conversation.json

# Search entire directory with batch tool
./aiquery_batch "knowledge graph" my_conversations_json/

# Export search results as Markdown report
./aiquery_batch -o results.md "architecture" my_conversations_json/

# Search with options
./aiquery --case-sensitive --limit 20 "neural networks" *.json

# Output as JSON
./aiquery --json "architecture" conversation.json
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

### Example 3: Batch process and search a directory

```bash
# Convert entire directory of markdown files
./md2json_batch ~/Downloads/ai_conversations/

# Search all converted files and generate report
./aiquery_batch -o search_results.md "machine learning" ~/Downloads/ai_conversations_json/
```

### Example 4: Integrate with scripts

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

### `md2json_batch`

Batch convert entire directories of markdown files to JSON.

```bash
md2json_batch <directory>

Description:
  Processes all .md files in a directory and creates a corresponding
  _json directory with converted .json files. Automatically handles
  both ChatGPT and Claude export formats.

Example:
  ./md2json_batch my_conversations/
  # Creates my_conversations_json/ with all converted files
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

### `aiquery_batch`

Batch search across directories with optional Markdown report export.

```bash
aiquery_batch [OPTIONS] <search-term> <directory>

Options:
  -o <file>            Export results as Markdown report
  -l N                 Limit results per file (default: 10)

Description:
  Searches all .json files in a directory and aggregates results.
  With -o flag, generates a formatted Markdown report with file
  attribution for each match.

Examples:
  ./aiquery_batch "neural networks" conversations_json/
  ./aiquery_batch -o report.md -l 20 "DPDK" conversations_json/
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
chmod +x md2json md2json_batch aiquery aiquery_batch

# Check they're in your PATH or use ./
./md2json --version
./aiquery_batch --help
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
