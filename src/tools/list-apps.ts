
/**
 * Tool: list_apps
 *
 * List installed apps on the booted simulator using 'idb list-apps --json'.
 * Useful for discovering bundle IDs.
 */

import { z } from "zod";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export const listAppsSchema = z.object({
    all: z.boolean().optional().describe("If true, list system apps as well. Default is false (user apps only)."),
});

interface AppInfo {
    bundle_id: string;
    name: string;
    install_type: string;
    architectures: string[];
    process_state: string;
    debuggable: boolean;
    pid: number | null;
}

export async function listApps(input: z.infer<typeof listAppsSchema>) {
    try {
        const { stdout } = await execFileAsync("idb", ["list-apps", "--json"]);

        const apps: AppInfo[] = stdout
            .trim()
            .split("\n")
            .filter((line) => line.trim().length > 0)
            .map((line) => {
                try {
                    return JSON.parse(line);
                } catch {
                    return null;
                }
            })
            .filter((app): app is AppInfo => app !== null);

        // Filter based on input.all
        const filteredApps = input.all
            ? apps
            : apps.filter((app) => app.install_type === "user");

        // Format for readability
        const formattedList = filteredApps.map((app) => ({
            name: app.name,
            bundleId: app.bundle_id,
            type: app.install_type,
            state: app.process_state,
        }));

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(formattedList, null, 2),
                },
            ],
        };
    } catch (error: any) {
        // If idb is not installed or fails
        if (error.code === "ENOENT") {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: "Error: 'idb' command not found. Please install idb to use this tool.\n" +
                            "Run: brew install idb-companion && pip3 install fb-idb",
                    },
                ],
                isError: true,
            };
        }
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Error listing apps: ${error.message || String(error)}`,
                },
            ],
            isError: true,
        };
    }
}
