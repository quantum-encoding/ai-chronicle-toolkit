# aiquery Batch Search

**Author:** Richard Tune <rich@quantumencoding.io>
**Company:** QUANTUM ENCODING LTD
**Part of:** AI Chronicle Toolkit

---

## Overview

The `aiquery_batch` tool extends the single-file search capability of `aiquery` to support batch directory processing. Search across hundreds of conversation JSON files with a single command.

## Features

✅ **Automatic Directory Scanning**
- Recursively processes all `.json` files in directory
- Maintains single-file search compatibility
- Smart detection of file vs. directory targets

✅ **Multiple Display Modes**
- **Full Content Mode**: Shows matching excerpts with context
- **Files-Only Mode** (`-f`): Compact list of matching files with counts
- **Limited Results** (`-l N`): Cap results per file to prevent overwhelming output

✅ **Comprehensive Statistics**
- Files processed count
- Files with matches count
- Total matches across all files
- Per-file match counts

## Usage

### Basic Batch Search

```bash
./aiquery_batch <search_term> <directory>
```

### Single File Search (Compatible)

```bash
./aiquery_batch <search_term> <file.json>
```

## Command-Line Options

| Option | Description |
|--------|-------------|
| `-h, --help` | Show help message |
| `-s, --stats` | Show conversation statistics only (single file) |
| `-f, --files` | Only list files with matches (no content) |
| `-l N, --limit N` | Limit results per file to N matches |

## Examples

### 1. Full Content Search

```bash
./aiquery_batch "quantum" convos-chatGPT_json
```

Shows matching excerpts from all files containing "quantum".

### 2. Files-Only Listing

```bash
./aiquery_batch -f "neural network" convos-chatGPT_json
```

Output:
```
Matching Files:
────────────────────────────────────────────────────────────────────────────────
convos-chatGPT_json/AI_Architecture_20250803.json           15 matches
convos-chatGPT_json/Deep_Learning_Notes_20250802.json       8 matches
convos-chatGPT_json/ML_Theory_20250801.json                 3 matches
```

### 3. Limited Results Per File

```bash
./aiquery_batch -l 3 "mirror guard" convos-chatGPT_json
```

Shows only first 3 matches from each file to prevent overwhelming output.

### 4. Single File Search

```bash
./aiquery_batch "search term" conversation.json
```

Works identically to original `aiquery` behavior.

## Output Format

### Batch Summary

```
════════════════════════════════════════════════════════════════════════════════
Batch Search Summary
════════════════════════════════════════════════════════════════════════════════
Search term:        "quantum"
Directory:          convos-chatGPT_json
Files processed:    333
Files with matches: 1
Total matches:      30
════════════════════════════════════════════════════════════════════════════════
```

### Individual Match (Full Content Mode)

```
================================================================================
Result #1
================================================================================
Type:     MESSAGE
Role:     assistant
Order:    42
--------------------------------------------------------------------------------
The quantum entanglement pattern you described aligns with the "mirror guard"
architecture we discussed earlier. This creates a bidirectional sync...
================================================================================
```

## Use Cases

### 1. Multi-File Research

Search across your entire AI conversation archive:

```bash
./aiquery_batch "machine learning" convos-chatGPT_json
```

### 2. Quick File Discovery

Find which conversations mention a topic:

```bash
./aiquery_batch -f "CUDA" convos-chatGPT_json
```

### 3. Focused Investigation

Limit results to get overview before deep dive:

```bash
./aiquery_batch -l 5 "performance optimization" convos-chatGPT_json
```

### 4. Integration with Workflow

```bash
# Convert markdown exports to JSON
./md2json_batch convos-chatGPT

# Search the converted files
./aiquery_batch "search term" convos-chatGPT_json
```

## Performance

- **Typical Speed**: ~100-150 files/second on modern hardware
- **Memory**: Processes one file at a time (streaming)
- **Scale**: Tested with 333 files (multiple GB total)

## Technical Details

- **Language:** C11
- **Search:** Case-insensitive substring matching
- **Format:** Expects AI Chronicle Toolkit JSON format
- **File Filter:** Processes only `.json` files
- **Platform:** Linux, macOS, Windows (with MinGW)

## Comparison with Single-File Tool

| Feature | aiquery (original) | aiquery_batch |
|---------|-------------------|---------------|
| Single file search | ✅ | ✅ |
| Directory search | ❌ | ✅ |
| Files-only mode | ❌ | ✅ |
| Result limiting | ❌ | ✅ |
| Batch statistics | ❌ | ✅ |

## Integration with AI Chronicle Toolkit

Works seamlessly with:
- **md2json** - Single file markdown → JSON conversion
- **md2json_batch** - Batch markdown → JSON conversion
- **anthropic_export_extractor** - Claude conversation extraction

## Building from Source

```bash
gcc -Wall -Wextra -std=c11 -O2 \
    query_cli_batch.c \
    query_engine.c \
    json_parser.c \
    -o aiquery_batch \
    -lm
```

## Dependencies

- `query_engine.c` / `query_engine.h` - Search logic
- `json_parser.c` / `json_parser.h` - JSON parsing
- Standard C library + math library (`-lm`)

## Error Handling

Gracefully handles:
- ✅ Missing directories
- ✅ Invalid JSON files
- ✅ Permission errors
- ✅ Empty directories
- ✅ Mixed file types (only processes `.json`)

Failed files are skipped with error messages logged.

## Help Command

```bash
./aiquery_batch --help
```

Shows complete usage information with examples.

## Version

**v1.0.0** - Initial release (2025-10-03)

---

**Built with precision. Built for production. Built by QUANTUM ENCODING LTD.**
