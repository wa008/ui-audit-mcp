import { z } from "zod";
import { DIMENSIONS } from "../evaluation/checklist.js";

export const getEvaluationCriteriaSchema = z.object({
    dimension: z.string().optional().describe("ID of the dimension (e.g., 'overlap'). Omit to list all available dimensions."),
});

export async function getEvaluationCriteria(input: z.infer<typeof getEvaluationCriteriaSchema>) {
    if (!input.dimension) {
        return {
            content: [{
                type: "text" as const,
                text: JSON.stringify({
                    availableDimensions: DIMENSIONS.map(d => ({ id: d.id, name: d.name })),
                    tip: "Call get_evaluation_criteria with a specific dimension ID to see its scoring rubric."
                }, null, 2),
            }],
        };
    }

    const criteria = DIMENSIONS.find(d => d.id === input.dimension);
    if (!criteria) {
        throw new Error(`Dimension '${input.dimension}' not found. Available dimensions: ${DIMENSIONS.map(d => d.id).join(", ")}`);
    }

    const markdown = `# 审计准则：${criteria.name} [${criteria.id}]\n\n` +
        `## 🧠 核心考察点 (Description)\n${criteria.description}\n\n` +
        `## 📊 评分细则 (Scoring Guide)\n${criteria.scoringGuide}\n`;

    return {
        content: [{ type: "text" as const, text: markdown }],
    };
}
