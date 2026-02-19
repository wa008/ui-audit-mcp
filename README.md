# UI Audit MCP

An MCP server for iOS app UI evaluation and testing.

## Features
- **Device Control**: Launch apps, take screenshots, tap, and swipe on iOS Simulators.
- **UI Evaluation**: Structured checklists for quality and style consistency.

## Prerequisites
- **Node.js 18+**
- **Xcode CLI Tools**: `xcode-select --install` (for `xcrun simctl`)
- **idb**: Required for tap/swipe.
  ```bash
  brew install idb-companion
  pip3 install fb-idb
  ```

## Quick Install (via npx)
Add this to your MCP client config (e.g., `claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "ui-audit": {
      "command": "npx",
      "args": ["-y", "@wa008/ui-audit-mcp"]
    }
  }
}
```
*(Note: Requires the package to be published to NPM. For local development, use the Setup steps below.)*

## Manual Setup
```bash
git clone https://github.com/wa008/ui-audit-mcp.git
cd ui-audit-mcp
npm install
```

### Manual Config
```json
{
  "mcpServers": {
    "ui-audit": {
      "command": "node",
      "args": ["/absolute/path/to/ui-audit-mcp/dist/src/index.js"]
    }
  }
}
```

## Tools
| Tool | Purpose |
|---|---|
| `launch_app` | Launch app by Bundle ID |
| `list_apps` | keys to find Bundle IDs |
| `take_screenshot` | Capture screen & metadata |
| `tap` / `swipe` | Interact with UI (ratio coordinates 0-1) |
| `get_checklist` | Start evaluation session (screen/style) |
| `submit_evaluation` | Submit scores (1-5) & get pass/fail result |
| `evaluate_style_consistency` | Compare multiple screens |
| `get_evaluation_log` | Review past results |

## Typical Workflow
1. `list_apps(all: false)` → Find Bundle ID
2. `launch_app("com.example.app")`
3. `take_screenshot()`
4. `get_checklist(type: "screen")` → Get session ID
5. Agent analyzes UI → `submit_evaluation(sessionId, scores)`

## Data
Logs: `~/.ui-audit-mcp/logs/`
Screenshots: `~/.ui-audit-mcp/screenshots/`

## License
MIT
