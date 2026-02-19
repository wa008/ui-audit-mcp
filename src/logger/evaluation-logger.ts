/**
 * Evaluation logger — persists evaluation results to disk
 * and provides query / summary capabilities.
 *
 * Storage layout:
 *   ~/.ui-audit-mcp/logs/<sessionId>.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import {
    ChecklistItem,
    EvaluationOutcome,
    LogEntry,
    LogSummary,
    ScoreEntry,
} from "../types.js";

const LOG_DIR = path.join(os.homedir(), ".ui-audit-mcp", "logs");

function ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/** Persist a completed evaluation. */
export function saveLog(
    outcome: EvaluationOutcome,
    checklist: ChecklistItem[],
    scores: ScoreEntry[]
): string {
    ensureDir(LOG_DIR);
    const entry: LogEntry = { ...outcome, checklist, scores };
    const filePath = path.join(LOG_DIR, `${outcome.sessionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), "utf-8");
    return filePath;
}

/** Load a single log by session ID. */
export function loadLog(sessionId: string): LogEntry | null {
    const filePath = path.join(LOG_DIR, `${sessionId}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as LogEntry;
}

/** Load all logs, sorted by timestamp descending. */
function loadAllLogs(): LogEntry[] {
    ensureDir(LOG_DIR);
    const files = fs
        .readdirSync(LOG_DIR)
        .filter((f) => f.endsWith(".json"));

    const entries: LogEntry[] = files.map((f) => {
        const raw = fs.readFileSync(path.join(LOG_DIR, f), "utf-8");
        return JSON.parse(raw) as LogEntry;
    });

    // Sort newest first
    entries.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return entries;
}

/** Query logs with optional filters. */
export function queryLogs(
    sessionId?: string,
    limit: number = 10
): { logs: LogEntry[]; summary: LogSummary } {
    if (sessionId) {
        const entry = loadLog(sessionId);
        const logs = entry ? [entry] : [];
        return { logs, summary: buildSummary(logs) };
    }

    const all = loadAllLogs();
    const logs = all.slice(0, limit);
    return { logs, summary: buildSummary(all) };
}

/** Count how many times a specific screen has been evaluated. */
export function countScreenAttempts(screenName: string): number {
    const all = loadAllLogs();
    return all.filter((l) => l.screenName === screenName).length;
}

/** Build summary statistics from a list of log entries. */
function buildSummary(logs: LogEntry[]): LogSummary {
    const screens: LogSummary["screens"] = {};

    for (const log of logs) {
        const key = log.screenName;
        if (!screens[key]) {
            screens[key] = {
                attempts: 0,
                finalPassed: false,
                finalScore: 0,
            };
        }
        screens[key].attempts++;
    }

    // For each screen, find the latest evaluation as the "final" result
    for (const key of Object.keys(screens)) {
        const screenLogs = logs
            .filter((l) => l.screenName === key)
            .sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
        if (screenLogs.length > 0) {
            screens[key].finalPassed = screenLogs[0].overallPassed;
            screens[key].finalScore = screenLogs[0].averageScore;
        }
    }

    return {
        totalEvaluations: logs.length,
        passedCount: logs.filter((l) => l.overallPassed).length,
        failedCount: logs.filter((l) => !l.overallPassed).length,
        screens,
    };
}
