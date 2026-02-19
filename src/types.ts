/**
 * Core type definitions for ui-audit-mcp
 */

// ─── Checklist ───────────────────────────────────────────────

export interface ChecklistItem {
    id: string;
    name: string;
    description: string;
    scoringGuide: string;
}

export type EvaluationType = "screen" | "style";

// ─── Evaluation Session ──────────────────────────────────────

export interface EvaluationSession {
    sessionId: string;
    type: EvaluationType;
    screenName: string;
    checklist: ChecklistItem[];
    passingScore: number;
    createdAt: string;
}

// ─── Score Submission ────────────────────────────────────────

export interface ScoreEntry {
    id: string;
    score: number; // 1-5
    reason: string;
    suggestion?: string;
}

export interface EvaluationResult {
    id: string;
    score: number;
    passed: boolean;
    reason: string;
    suggestion?: string;
}

export interface EvaluationOutcome {
    sessionId: string;
    type: EvaluationType;
    screenName: string;
    overallPassed: boolean;
    averageScore: number;
    results: EvaluationResult[];
    failedItems: string[];
    timestamp: string;
    attemptNumber: number;
}

// ─── Logs ────────────────────────────────────────────────────

export interface LogItemDetail {
    id: string;
    name: string;
    score: number;
    reason: string;
    suggestion?: string;
}

export interface LogEntry {
    meta: {
        sessionId: string;
        timestamp: string;
        screenName: string;
        attemptNumber: number;
        type: EvaluationType;
    };
    summary: {
        passed: boolean;
        averageScore: number;
    };
    failures: LogItemDetail[];
    passes: LogItemDetail[];
}

export interface LogSummary {
    totalEvaluations: number;
    passedCount: number;
    failedCount: number;
    screens: Record<
        string,
        { attempts: number; finalPassed: boolean; finalScore: number }
    >;
}
