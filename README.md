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
      "args": ["-y", "@wa007/ui-audit-mcp"]
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
| `take_screenshot` | Capture screen & track evaluation step |
| `tap` / `swipe` | Interact with UI (ratio coordinates), screenshot, and track step |
| `get_evaluation_criteria` | Get dimensions and scoring rubrics (Prompts) |
| `submit_dimension_score` | Submit score (1-10) for a single dimension on a tracked step |
| `get_audit_status` | View missing evaluations dashboard or final markdown report |

## Typical Workflow
1. `launch_app("com.example.app")`
2. `take_screenshot("MyTestCase", 1, "Verify Initial Screen")` or `tap(0.5, 0.5, "MyTestCase", 2, "Click Login")`
3. `get_evaluation_criteria("overlap")` → Read the prompt for overlap
4. Agent analyzes UI → `submit_dimension_score("MyTestCase", 1, "overlap", 9, "No overlap")`
5. Repeat 3-4 until all dimensions are evaluated for the step
6. `get_audit_status(["MyTestCase"])` → Output the full markdown report

## Data
Logs: `~/.ui-audit-mcp/logs/`
Screenshots: `~/.ui-audit-mcp/screenshots/`

## License
MIT
