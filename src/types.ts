/**
 * Core type definitions for ui-audit-mcp
 */

export interface ChecklistItem {
    id: string;
    name: string;
    description: string;
    scoringGuide: string;
}

export interface DimensionScore {
    score: number; // 1-10
    reason: string;
}

export interface StepRecord {
    stepIndex: number;
    description: string;
    actionType: "tap" | "swipe" | "screenshot";
    coordinates?: { x: number; y: number };
    screenshotPath: string;
    timestamp: string;
    evaluations: Record<string, DimensionScore>;
}

export interface AuditLog {
    caseName: string;
    steps: Record<number, StepRecord>;
}
