import fs from "fs";
import path from "path";
import os from "os";
import { AuditLog, StepRecord, DimensionScore } from "../types.js";

const BASE_DIR = path.join(os.homedir(), ".ui-audit-mcp");
const LOG_DIR = path.join(BASE_DIR, "logs");
const SCREENSHOT_DIR = path.join(BASE_DIR, "screenshots");

// Ensure directories exist
function ensureDirs() {
    if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR, { recursive: true });
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

ensureDirs();

function getLogPath(caseName: string): string {
    return path.join(LOG_DIR, `${caseName}.json`);
}

export function readLog(caseName: string): AuditLog | null {
    const logPath = getLogPath(caseName);
    if (!fs.existsSync(logPath)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(logPath, "utf-8"));
}

export function writeLog(log: AuditLog): void {
    const logPath = getLogPath(log.caseName);
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2), "utf-8");
}

export function readAllLogs(): AuditLog[] {
    const logs: AuditLog[] = [];
    if (!fs.existsSync(LOG_DIR)) return logs;
    const files = fs.readdirSync(LOG_DIR);
    for (const file of files) {
        if (file.endsWith(".json")) {
            const content = fs.readFileSync(path.join(LOG_DIR, file), "utf-8");
            try {
                logs.push(JSON.parse(content));
            } catch (e) {
                console.error(`Failed to parse log file: ${file}`, e);
            }
        }
    }
    return logs;
}

export function recordStep(
    caseName: string,
    stepIndex: number,
    description: string,
    actionType: "tap" | "swipe" | "screenshot",
    screenshotPath: string,
    coordinates?: { x: number; y: number },
    expectedOutcome?: string
): void {
    let log = readLog(caseName);
    if (!log) {
        log = {
            caseName,
            steps: {},
        };
    }

    const existingStep = log.steps[stepIndex];

    log.steps[stepIndex] = {
        stepIndex,
        description,
        actionType,
        screenshotPath,
        coordinates,
        expectedOutcome,
        timestamp: new Date().toISOString(),
        evaluations: existingStep ? existingStep.evaluations : {},
    };

    writeLog(log);
}

export function recordScore(
    caseName: string,
    stepIndex: number,
    dimension: string,
    score: number,
    reason: string
): void {
    const log = readLog(caseName);
    if (!log) {
        throw new Error(`Test case not found: ${caseName}`);
    }

    const step = log.steps[stepIndex];
    if (!step) {
        throw new Error(`Step ${stepIndex} not found in case ${caseName}`);
    }

    step.evaluations[dimension] = {
        score,
        reason,
    };

    writeLog(log);
}
