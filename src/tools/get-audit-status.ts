import { z } from "zod";
import { readLog, readAllLogs } from "../logger/audit-log.js";
import { REQUIRED_DIMS, PASSING_SCORE } from "../evaluation/checklist.js";
import { AuditLog } from "../types.js";

export const getAuditStatusSchema = z.object({
    caseNames: z.array(z.string()).optional().describe("Optional list of caseNames to explicitly query. Omit to view global dashboard."),
});

// Helper for rendering incomplete template
function renderIncompleteTemplate(log: AuditLog, missingItems: { stepIndex: number; missing: string[] }[]): string {
    let md = `# 📊 Audit Progress Report: ${log.caseName}\n`;
    md += `**Status**: 🚧 Evaluation Incomplete\n\n`;

    // Missing summary
    md += `## 🔴 Pending Evaluations\n`;
    md += `Attention Agent: You still need to complete the evaluations for the following dimensions to generate the final report:\n`;
    for (const item of missingItems) {
        md += `- Step ${item.stepIndex}: Missing [${item.missing.join(", ")}]\n`;
    }
    md += `\n`;

    // Step details
    md += `## 📝 Evaluated Records\n`;
    md += renderStepDetails(log);

    return md;
}

// Helper for rendering complete template
function renderCompleteTemplate(log: AuditLog, avg: number, passed: boolean, failedItems: any[]): string {
    let md = `# 🏆 Final Audit Report: ${log.caseName}\n`;
    md += `**Status**: ✅ Evaluation Complete\n\n`;

    md += `## 📈 Overall Scores\n`;
    md += `- **Average Score**: ${avg.toFixed(1)} / 10\n`;
    md += `- **Result**: ${passed ? "✅ Pass" : "❌ Fail"}\n`;

    if (failedItems.length > 0) {
        md += `- **Failed Items**:\n`;
        for (const f of failedItems) {
            md += `  - Step ${f.stepIndex} [${f.dim}]: Score ${f.score} - ${f.reason}\n`;
        }
    } else {
        md += `- **Failed Items**: None\n`;
    }
    md += `\n`;

    md += `## 📝 Detailed Steps\n`;
    md += renderStepDetails(log);

    return md;
}

function renderStepDetails(log: AuditLog): string {
    let md = "";
    const steps = Object.values(log.steps).sort((a, b) => a.stepIndex - b.stepIndex);
    for (const step of steps) {
        md += `### Step ${step.stepIndex}: ${step.description}\n`;
        md += `- **Action**: ${step.actionType} ${step.coordinates ? `(x: ${step.coordinates.x}, y: ${step.coordinates.y})` : ""}\n`;
        if (step.expectedOutcome) {
            md += `- **Expected Outcome**: ${step.expectedOutcome}\n`;
        }

        for (const dim of REQUIRED_DIMS) {
            const ev = step.evaluations ? step.evaluations[dim] : undefined;
            if (ev) {
                const tag = ev.score >= PASSING_SCORE ? "Pass ✅" : "Fail ❌";
                md += `- **${dim}**: Score ${ev.score} ${tag} - ${ev.reason}\n`;
            } else {
                md += `- **${dim}**: 🔴 Missing Evaluation\n`;
            }
        }
        md += `\n`;
    }
    return md;
}

export async function getAuditStatus(input: z.infer<typeof getAuditStatusSchema>) {
    let logs: AuditLog[] = [];
    if (input.caseNames && input.caseNames.length > 0) {
        for (const name of input.caseNames) {
            const log = readLog(name);
            if (log) logs.push(log);
        }
    } else {
        logs = readAllLogs();
    }

    if (logs.length === 0) {
        return {
            content: [{ type: "text" as const, text: "No audit logs found. Please use device interaction tools to create a new case." }]
        };
    }

    let reportMarkdown = "";

    for (const log of logs) {
        let allComplete = true;
        let totalScore = 0;
        let totalCount = 0;
        let failedItems: any[] = [];
        let missingItems: { stepIndex: number; missing: string[] }[] = [];

        for (const step of Object.values(log.steps)) {
            const evaluated = Object.keys(step.evaluations || {});
            const missing = REQUIRED_DIMS.filter(d => !evaluated.includes(d));

            if (missing.length > 0) {
                allComplete = false;
                missingItems.push({ stepIndex: step.stepIndex, missing });
            }

            for (const [dim, ev] of Object.entries(step.evaluations || {})) {
                totalScore += ev.score;
                totalCount += 1;
                if (ev.score < PASSING_SCORE) {
                    failedItems.push({ stepIndex: step.stepIndex, dim, score: ev.score, reason: ev.reason });
                }
            }
        }

        if (!allComplete) {
            reportMarkdown += renderIncompleteTemplate(log, missingItems) + "---\n\n";
        } else {
            const avg = totalCount > 0 ? totalScore / totalCount : 0;
            const passed = failedItems.length === 0;
            reportMarkdown += renderCompleteTemplate(log, avg, passed, failedItems) + "---\n\n";
        }
    }

    return {
        content: [{ type: "text" as const, text: reportMarkdown.trim() }]
    };
}
