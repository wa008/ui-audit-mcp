import { z } from "zod";
import * as device from "../device/adapter.js";
import { recordStep } from "../logger/audit-log.js";

export const inputTextSchema = z.object({
    text: z.string().describe("Text to type into the currently focused field"),
    caseName: z.string().describe("Name of the test case"),
    stepIndex: z.number().int().positive().describe("Current step index (e.g. 1, 2)"),
    description: z.string().describe("Description of the action being performed"),
    expectedOutcome: z.string().describe("What should happen after typing (e.g. 'Search results should appear')"),
});

export async function inputText(input: z.infer<typeof inputTextSchema>) {
    const result = await device.inputText(input.text);
    if (!result.success) {
        return {
            content: [{ type: "text" as const, text: `Failed to input text: ${result.error}` }],
        };
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const screenshot = await device.takeScreenshot();
    recordStep(
        input.caseName,
        input.stepIndex,
        input.description,
        "input_text",
        screenshot.filePath,
        undefined,
        input.expectedOutcome
    );

    return {
        content: [
            {
                type: "image" as const,
                data: screenshot.imageBase64,
                mimeType: "image/png" as const,
            },
            {
                type: "text" as const,
                text: JSON.stringify({
                    message: `Step ${input.stepIndex} recorded. Expected: "${input.expectedOutcome}". Please call evaluate to retrieve the first evaluation dimension and its token before proceeding.`,
                    caseName: input.caseName,
                    stepIndex: input.stepIndex,
                    expectedOutcome: input.expectedOutcome,
                    screenWidth: screenshot.width,
                    screenHeight: screenshot.height,
                }),
            },
        ],
    };
}
