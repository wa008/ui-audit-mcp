import { z } from "zod";
import { readLog, readAllLogs } from "../logger/audit-log.js";
import { REQUIRED_DIMS, PASSING_SCORE } from "../evaluation/checklist.js";
import { AuditLog } from "../types.js";

export const getAuditStatusSchema = z.object({
    caseNames: z.array(z.string()).optional().describe("Optional list of caseNames to explicitly query. Omit to view global dashboard."),
});

// Helper for rendering incomplete template
function renderIncompleteTemplate(log: AuditLog, missingItems: { stepIndex: number; missing: string[] }[]): string {
    let md = `# 📊 审计进度报告: ${log.caseName}\n`;
    md += `**状态**: 🚧 评估未完成\n\n`;

    // Missing summary
    md += `## 🔴 待办评估任务 (Pending Evaluations)\n`;
    md += `Agent 请注意：您还需要完成以下维度的评估才能生成最终成绩：\n`;
    for (const item of missingItems) {
        md += `- Step ${item.stepIndex}: 缺失 [${item.missing.join(", ")}]\n`;
    }
    md += `\n`;

    // Step details
    md += `## 📝 已评估记录\n`;
    md += renderStepDetails(log);

    return md;
}

// Helper for rendering complete template
function renderCompleteTemplate(log: AuditLog, avg: number, passed: boolean, failedItems: any[]): string {
    let md = `# 🏆 最终审计报告: ${log.caseName}\n`;
    md += `**状态**: ✅ 评估已完成\n\n`;

    md += `## 📈 总成绩单\n`;
    md += `- **平均分**: ${avg.toFixed(1)} / 10\n`;
    md += `- **结论**: ${passed ? "✅ 通过 (Pass)" : "❌ 驳回 (Fail)"}\n`;

    if (failedItems.length > 0) {
        md += `- **不合格项**:\n`;
        for (const f of failedItems) {
            md += `  - Step ${f.stepIndex} [${f.dim}]: ${f.score}分 - ${f.reason}\n`;
        }
    } else {
        md += `- **不合格项**: 无\n`;
    }
    md += `\n`;

    md += `## 📝 详细步骤\n`;
    md += renderStepDetails(log);

    return md;
}

function renderStepDetails(log: AuditLog): string {
    let md = "";
    const steps = Object.values(log.steps).sort((a, b) => a.stepIndex - b.stepIndex);
    for (const step of steps) {
        md += `### Step ${step.stepIndex}: ${step.description}\n`;
        md += `- **操作**: ${step.actionType} ${step.coordinates ? `(x: ${step.coordinates.x}, y: ${step.coordinates.y})` : ""}\n`;

        for (const dim of REQUIRED_DIMS) {
            const ev = step.evaluations ? step.evaluations[dim] : undefined;
            if (ev) {
                const tag = ev.score >= PASSING_SCORE ? "Pass ✅" : "Fail ❌";
                md += `- **${dim}**: ${ev.score}分 ${tag} - ${ev.reason}\n`;
            } else {
                md += `- **${dim}**: 🔴 缺失评估\n`;
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
