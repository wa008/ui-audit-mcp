/**
 * Scoring logic — determines pass / fail for each checklist item
 * and computes the overall evaluation outcome.
 */

import {
    ChecklistItem,
    EvaluationOutcome,
    EvaluationResult,
    EvaluationType,
    ScoreEntry,
} from "../types.js";

export function evaluateScores(
    sessionId: string,
    type: EvaluationType,
    screenName: string,
    checklist: ChecklistItem[],
    scores: ScoreEntry[],
    passingScore: number,
    attemptNumber: number
): EvaluationOutcome {
    const results: EvaluationResult[] = checklist.map((item) => {
        const entry = scores.find((s) => s.id === item.id);
        const score = entry?.score ?? 0;
        const passed = score >= passingScore;
        return {
            id: item.id,
            score,
            passed,
            reason: entry?.reason,
            suggestion: entry?.suggestion,
        };
    });

    const failedItems = results.filter((r) => !r.passed).map((r) => r.id);
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore =
        results.length > 0
            ? parseFloat((totalScore / results.length).toFixed(2))
            : 0;

    return {
        sessionId,
        type,
        screenName,
        overallPassed: failedItems.length === 0,
        averageScore,
        results,
        failedItems,
        timestamp: new Date().toISOString(),
        attemptNumber,
    };
}
