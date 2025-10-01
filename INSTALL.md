# Installation Guide - AI Chronicle Toolkit

Complete installation instructions for all platforms.

---

## 📦 Quick Install (Recommended)

### Download Pre-compiled Binaries

**macOS / Linux:**

```bash
# Download latest release
wget https://github.com/quantum-encoding/ai-chronicle-toolkit/releases/latest/download/ai-chronicle-toolkit.tar.gz

# Extract
tar -xzf ai-chronicle-toolkit.tar.gz
cd ai-chronicle-toolkit

# Make executable
chmod +x md2json aiquery

# Test
./md2json --version
./aiquery --version
```

**macOS (Homebrew):**

```bash
# Coming soon
brew install quantum-encoding/tap/ai-chronicle-toolkit
```

---

## 🔧 Compile from Source

### Prerequisites

You'll need:
- **C Compiler:** gcc or clang
- **Make:** GNU Make
- **Git:** To clone the repository

### macOS

```bash
# Install Xcode Command Line Tools (if not already installed)
xcode-select --install

# Clone repository
git clone https://github.com/quantum-encoding/ai-chronicle-toolkit.git
cd ai-chronicle-toolkit

# Compile
make

# Test
./md2json --version
./aiquery --version

# Optional: Install to /usr/local/bin
sudo make install
```

### Linux (Ubuntu/Debian)

```bash
# Install dependencies
sudo apt update
sudo apt install build-essential git

# Clone repository
git clone https://github.com/quantum-encoding/ai-chronicle-toolkit.git
cd ai-chronicle-toolkit

# Compile
make

# Test
./md2json --version
./aiquery --version

# Optional: Install system-wide
sudo make install
```

### Linux (Fedora/RHEL)

```bash
# Install dependencies
sudo dnf install gcc make git

# Clone repository
git clone https://github.com/quantum-encoding/ai-chronicle-toolkit.git
cd ai-chronicle-toolkit

# Compile
make

# Test
./md2json --version
./aiquery --version

# Optional: Install system-wide
sudo make install
```

### Linux (Arch)

```bash
# Install dependencies (likely already installed)
sudo pacman -S base-devel git

# Clone repository
git clone https://github.com/quantum-encoding/ai-chronicle-toolkit.git
cd ai-chronicle-toolkit

# Compile
make

# Test
./md2json --version
./aiquery --version

# Optional: Install system-wide
sudo make install
```

### Windows (WSL)

```bash
# Open WSL (Ubuntu recommended)
# Then follow Linux (Ubuntu/Debian) instructions above

# Install WSL if needed:
# wsl --install
```

---

## 🖥️ Server Setup (Optional)

The Node.js server is **optional** and only needed for browser extension integration.

### Install Node.js

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

### Install Server Dependencies

```bash
cd ai-chronicle-toolkit
npm install
```

### Start Server

```bash
node server.js

# Custom port
node server.js --port 3778

# Verbose logging
node server.js --verbose
```

Server will run on `http://localhost:3777`

---

## ✅ Verification

### Test the Tools

```bash
# Create a test markdown file
echo "# Test Conversation

## Message 1

Hello, world!

## Message 2

This is a test.
" > test.md

# Convert to JSON
./md2json test.md > test.json

# Search
./aiquery "test" test.json
```

Expected output:
```
📁 test.json
  [Message #2] AI: "This is a test."
```

### Test the Server (if installed)

```bash
# Start server in background
node server.js &

# Test health endpoint
curl http://localhost:3777/health

# Expected response:
# {"status":"ok","tools":{"md2json":true,"aiquery":true,"ready":true}}

# Stop server
pkill -f "node server.js"
```

---

## 🔧 Manual Compilation

If `make` doesn't work, compile manually:

### md2json

```bash
gcc -O3 -Wall -o md2json src/md2json.c
```

### aiquery

```bash
gcc -O3 -Wall -o aiquery src/aiquery.c
```

---

## 📁 File Locations

After installation:

```
/usr/local/bin/
  ├── md2json       # Main converter binary
  ├── aiquery       # Search binary

/usr/local/share/ai-chronicle-toolkit/
  └── server.js     # Optional HTTP server
```

---

## 🐛 Troubleshooting

### "Permission denied" when running binaries

```bash
chmod +x md2json aiquery
```

### "Command not found" after install

Make sure `/usr/local/bin` is in your PATH:

```bash
echo $PATH | grep '/usr/local/bin'

# If not in PATH, add to ~/.bashrc or ~/.zshrc:
export PATH="/usr/local/bin:$PATH"
```

### Compilation errors on macOS

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Accept license
sudo xcodebuild -license accept
```

### Server won't start - port already in use

```bash
# Check what's using port 3777
lsof -i :3777

# Use different port
node server.js --port 3778
```

### Missing npm packages

```bash
cd ai-chronicle-toolkit
npm install
```

---

## 🔄 Updating

### Update Pre-compiled Binaries

```bash
# Download latest release
wget https://github.com/quantum-encoding/ai-chronicle-toolkit/releases/latest/download/ai-chronicle-toolkit.tar.gz

# Extract (overwrites existing)
tar -xzf ai-chronicle-toolkit.tar.gz
```

### Update from Source

```bash
cd ai-chronicle-toolkit
git pull
make clean
make
sudo make install
```

---

## 🗑️ Uninstall

```bash
# If installed with make install
sudo make uninstall

# Or manually
sudo rm /usr/local/bin/md2json
sudo rm /usr/local/bin/aiquery
sudo rm -rf /usr/local/share/ai-chronicle-toolkit
```

---

## 💡 Tips

### Add to PATH (current directory)

```bash
# Add current directory to PATH temporarily
export PATH="$PWD:$PATH"

# Now you can use:
md2json file.md
aiquery "search term" file.json
```

### Create aliases

```bash
# Add to ~/.bashrc or ~/.zshrc
alias md2json="~/ai-chronicle-toolkit/md2json"
alias aiquery="~/ai-chronicle-toolkit/aiquery"
```

### Run server as systemd service (Linux)

```bash
# Create service file
sudo nano /etc/systemd/system/ai-chronicle.service

# Add:
[Unit]
Description=AI Chronicle Query Server
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/home/youruser/ai-chronicle-toolkit
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable ai-chronicle
sudo systemctl start ai-chronicle
```

---

## 📞 Support

Having issues? Get help:

- **GitHub Issues:** https://github.com/quantum-encoding/ai-chronicle-toolkit/issues
- **Email:** info@quantumencoding.io
- **Documentation:** Check the [README.md](README.md)

---

**Made with 🤍 by Quantum Encoding Ltd**
