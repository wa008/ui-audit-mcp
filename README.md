# UI Audit MCP

An MCP server for iOS app UI evaluation and testing.

## Features
- **Device Control**: Launch apps, take screenshots, tap, and swipe on iOS Simulators.
- **UI Evaluation**: 3-dimension user-perspective evaluation (outcome, usability, aesthetics).

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
| `take_screenshot` | Capture screen & track evaluation step |
| `tap` / `swipe` | Interact with UI (ratio coordinates), screenshot, and track step |
| `evaluate` | Unified evaluation: get dimension prompt (initial) or submit score + get next (submit mode) |
| `get_audit_status` | View missing evaluations dashboard or final markdown report |

## Evaluation Dimensions

Each step is evaluated on up to 3 dimensions, presented in order from easiest to hardest:

| # | Dimension | User's Question | Applied When |
|---|-----------|----------------|--------------|
| 1 | **outcome** | "Did my action produce the expected result?" | Action steps (tap/swipe) with `expectedOutcome` |
| 2 | **usability** | "Can I see everything, understand it, and interact smoothly?" | All steps |
| 3 | **aesthetics** | "Does this look professional and polished?" | All steps |

- For observation steps (no `expectedOutcome`), `outcome` is skipped automatically.
- Each dimension must be completed before the next one is presented.
- Pass threshold: score ≥ 8.

## Typical Workflow
1. `launch_app("com.example.app")`
2. `take_screenshot("MyTestCase", 1, "Verify Initial Screen")` or `tap(0.5, 0.5, "MyTestCase", 2, "Click Login")`
3. `evaluate("MyTestCase", 1)` → Returns the first dimension prompt + `evaluationToken`
4. Agent analyzes UI → `evaluate("MyTestCase", 1, token, 9, "Clean and clear")` → Records score, returns next dimension prompt + new token
5. Repeat step 4 until all dimensions are evaluated (2 for observation, 3 for action steps)
6. `get_audit_status(["MyTestCase"])` → Output the full markdown report

## Data
Logs: `~/.ui-audit-mcp/logs/`
Screenshots: `~/.ui-audit-mcp/screenshots/`

## License
MIT
