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

    const failures = outcome.results
        .filter((r) => !r.passed)
        .map((r) => ({
            id: r.id,
            name: checklist.find((c) => c.id === r.id)?.name ?? r.id,
            score: r.score,
            reason: r.reason,
            suggestion: r.suggestion,
        }));

    const passes = outcome.results
        .filter((r) => r.passed)
        .map((r) => ({
            id: r.id,
            name: checklist.find((c) => c.id === r.id)?.name ?? r.id,
            score: r.score,
            reason: r.reason,
            suggestion: r.suggestion, // Optional for passes
        }));

    const entry: LogEntry = {
        meta: {
            sessionId: outcome.sessionId,
            timestamp: outcome.timestamp,
            screenName: outcome.screenName,
            attemptNumber: outcome.attemptNumber,
            type: outcome.type,
        },
        summary: {
            passed: outcome.overallPassed,
            averageScore: outcome.averageScore,
        },
        failures,
        passes,
    };

    const filePath = path.join(LOG_DIR, `${outcome.sessionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), "utf-8");
    return filePath;
}

/** Load a single log by session ID. */
export function loadLog(sessionId: string): LogEntry | null {
    const filePath = path.join(LOG_DIR, `${sessionId}.json`);
    if (!fs.existsSync(filePath)) return null;
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // Simple check if it's new format
    if (raw.meta && raw.summary) return raw as LogEntry;
    return null; // Ignore old format
}

/** Load all logs, sorted by timestamp descending. Filters out legacy logs. */
function loadAllLogs(): LogEntry[] {
    ensureDir(LOG_DIR);
    const files = fs
        .readdirSync(LOG_DIR)
        .filter((f) => f.endsWith(".json"));

    const entries: LogEntry[] = [];
    for (const f of files) {
        try {
            const raw = JSON.parse(fs.readFileSync(path.join(LOG_DIR, f), "utf-8"));
            if (raw.meta && raw.summary) {
                entries.push(raw as LogEntry);
            }
        } catch {
            // Ignore malformed files
        }
    }

    // Sort newest first
    entries.sort(
        (a, b) =>
            new Date(b.meta.timestamp).getTime() - new Date(a.meta.timestamp).getTime()
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
    return all.filter((l) => l.meta.screenName === screenName).length;
}

/** Build summary statistics from a list of logs. */
function buildSummary(logs: LogEntry[]): LogSummary {
    const screens: LogSummary["screens"] = {};

    for (const log of logs) {
        const key = log.meta.screenName;
        if (!screens[key]) {
            screens[key] = {
                attempts: 0,
                finalPassed: false,
                finalScore: 0,
            };
        }
        screens[key].attempts++;
    }

    // For each screen, find the latest evaluation (already sorted by newest first)
    // We iterate again to find the first occurrence for "final" result
    const processedScreens = new Set<string>();
    for (const log of logs) {
        const key = log.meta.screenName;
        if (!processedScreens.has(key)) {
            screens[key].finalPassed = log.summary.passed;
            screens[key].finalScore = log.summary.averageScore;
            processedScreens.add(key);
        }
    }

    return {
        totalEvaluations: logs.length,
        passedCount: logs.filter((l) => l.summary.passed).length,
        failedCount: logs.filter((l) => !l.summary.passed).length,
        screens,
    };
}
