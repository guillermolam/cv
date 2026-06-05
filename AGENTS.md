# 🤖 Local AI Agent Environment (LM Studio + OpenCode)

This project uses a battle-tested local AI configuration to provide **100% free**, RAM-efficient, and offline-capable intelligence via **LM Studio** and the **OpenCode** CLI.

---

## 🚀 Quick Start (Restore Setup)

If RAM is tight or you need to restart the local provider, run these commands:

```bash
# 1. Clear any stuck models
lms unload --all

# 2. Load the optimized model (RNJ-1) with a spoofed ID and 32k context
lms load essentialai/rnj-1 \
  --identifier "qwen/qwen3.6-35b-a3b" \
  --context-length 32768 \
  --ttl 3600 \
  --yes

# 3. Verify with a simple prompt
opencode run -m lmstudio/qwen/qwen3.6-35b-a3b "Hello local AI"
```

---

## 📊 Current Battle-Tested Setup
- **Host Hardware:** MacBook Pro 32GB (M1/M2/M3 Max).
- **Primary Local Model:** `essentialai/rnj-1` (GGUF, ~5GB RAM).
- **Status:** Verified callable from `opencode` with project context enabled.
- **Provider ID:** `lmstudio` (Truly Free).

---

## 🛠️ LM Studio CLI (`lms`) Commands

The `lms` CLI is the primary way to manage your local hardware resources.

### Model Management
- **List available models:** `lms ls`
- **Check currently loaded models:** `lms ps` (Shows RAM usage and TTL).
- **Unload a specific model:** `lms unload <identifier>`
- **Unload everything:** `lms unload --all`
- **Download a new model:** `lms get <model-name-or-url>`

### Server & System
- **Check server status:** `lms server status`
- **Restart the background daemon:** `lms daemon up`
- **Check logs in real-time:** `lms log stream`

---

## ⚙️ Core Configurations

### Optimized Parameters for 32GB RAM
To keep the system responsive while running an IDE (Trae/VS Code) and browser:

| Parameter | Recommended | Purpose |
| :--- | :--- | :--- |
| **Context Length** | `32768` | **CRITICAL.** OpenCode sends ~20k tokens of project context. Anything lower will cause `Unexpected Server Error`. |
| **TTL** | `300` to `3600` | Time in seconds before the model auto-unloads from RAM. Use `300` (5 mins) for maximum RAM recovery. |
| **GPU Offload** | `max` | Offloads processing to the M1/M2/M3 GPU (Unified Memory). |
| **Parallelism** | `1` | Keep at 1 to prevent memory spikes on smaller machines. |

### Important Files & Paths
- **Main App Settings:** `~/.lmstudio/settings.json`
- **Model Defaults:** `~/.lmstudio/.internal/user-concrete-model-default-config/essentialai/rnj-1.json`
- **Server Logs:** `~/.lmstudio/server-logs/` (Useful for diagnosing `err_XXXX` codes).
- **Auth/Providers:** `~/.local/share/opencode/auth.json`

---

## 🧪 Testing with OpenCode

To verify the system is configured correctly, run these tests in order:

### 1. The "Pure" Test (No Context)
Checks if the provider is reachable and the model is loaded.
```bash
opencode run -m lmstudio/qwen/qwen3.6-35b-a3b --pure "hi"
```

### 2. The "Context" Test (Full Project)
Checks if the `context-length` (32k) is sufficient to handle the project size.
```bash
opencode run -m lmstudio/qwen/qwen3.6-35b-a3b "Explain this project structure"
```

### 3. The "Debug" Test (Error Analysis)
If it fails, use these flags to see the raw communication:
```bash
opencode run -m lmstudio/qwen/qwen3.6-35b-a3b "hi" --print-logs --log-level DEBUG
```

---

## ⚠️ Gotchas & FAQ

### Q: Why use the "qwen" identifier for a different model?
**The "Spoofing" Hack:** `opencode` has an internal whitelist of supported models for the `lmstudio` provider. By spoofing the identifier of a known model (like Qwen 35B) while actually loading a smaller one (like RNJ-1), we gain full functionality without the massive RAM penalty.

### Q: I'm getting an "Unexpected Server Error"
- **Cause A:** Model not loaded. Run `lms ps`.
- **Cause B:** Context too small. Ensure you used `--context-length 32768` during `lms load`.
- **Cause C:** Identifier mismatch. Ensure the ID in `opencode` matches the `--identifier` in `lms load`.

### Q: How do I run it without any local RAM?
If you don't need local privacy, use the free hosted models:
```bash
opencode run -m opencode/mimo-v2.5-free "your prompt"
```

---

## 📊 Example Input/Output

**Input:**
```bash
opencode run -m lmstudio/qwen/qwen3.6-35b-a3b "Say 'OK'"
```

**Output:**
```text
> build · qwen/qwen3.6-35b-a3b
OK.
```

---

## 📖 References
- [LM Studio CLI Docs](https://lmstudio.ai/docs/cli)
- [OpenCode CLI Help](run `opencode --help`)
- [System Memory Tools](run `memory_pressure` or `top -o mem`)
