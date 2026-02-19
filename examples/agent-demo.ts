
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";
import * as path from "path";
import * as os from "os";

// Connect to the local MCP server
async function run() {
    console.log("Starting MCP Client...");

    const transport = new StdioClientTransport({
        command: "node",
        args: [path.join(process.cwd(), "dist/src/index.js")],
    });

    const client = new Client(
        {
            name: "test-agent",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log("Connected to MCP server.");

        // 1. Launch App
        console.log("Launching Preferences app...");
        await client.callTool({
            name: "launch_app",
            arguments: { appId: "com.apple.Preferences" },
        });

        // 2. Take Screenshot
        console.log("Taking screenshot...");
        const screenshotResult: any = await client.callTool({
            name: "take_screenshot",
            arguments: {},
        });

        if (screenshotResult.imageBase64) {
            console.log(`Screenshot captured (${screenshotResult.width}x${screenshotResult.height})`);
        }

        // 3. Get Checklist (Screen)
        console.log("Getting checklist for 'SettingsScreen'...");
        const checklistResult: any = await client.callTool({
            name: "get_checklist",
            arguments: { type: "screen", screenName: "SettingsScreen" },
        });

        const checklistData = JSON.parse(checklistResult.content[0].text);
        const sessionId = checklistData.sessionId;
        const items = checklistData.checklist;

        console.log(`Session ID: ${sessionId}`);
        console.log(`Checklist items: ${items.map((i: any) => i.id).join(", ")}`);

        // 4. Submit Evaluation (Simulate passing)
        console.log("Submitting passing evaluation...");
        const scores = items.map((item: any) => ({
            id: item.id,
            score: 5,
        }));

        const evalResult: any = await client.callTool({
            name: "submit_evaluation",
            arguments: {
                sessionId: sessionId,
                scores: scores,
            },
        });

        console.log("Evaluation result:", JSON.parse(evalResult.content[0].text));

        // 5. Get Logs
        console.log("Fetching logs...");
        const logResult: any = await client.callTool({
            name: "get_evaluation_log",
            arguments: { limit: 1 },
        });

        console.log("Logs retrieved.");

    } catch (error) {
        console.error("Error running test agent:", error);
    } finally {
        // transport.close() is not exposed directly on StdioClientTransport in some versions,
        // but client.close() should handle it?
        // Actually, just exit process.
        process.exit(0);
    }
}

run();
