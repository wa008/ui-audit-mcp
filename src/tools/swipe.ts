/**
 * Tool: swipe
 * Swipe from one point to another using ratio coordinates (0-1).
 */

import { z } from "zod";
import * as device from "../device/adapter.js";

export const swipeSchema = z.object({
    startX: z.number().min(0).max(1).describe("Start horizontal ratio (0-1)"),
    startY: z.number().min(0).max(1).describe("Start vertical ratio (0-1)"),
    endX: z.number().min(0).max(1).describe("End horizontal ratio (0-1)"),
    endY: z.number().min(0).max(1).describe("End vertical ratio (0-1)"),
});

export async function swipe(input: z.infer<typeof swipeSchema>) {
    const result = await device.swipe(input.startX, input.startY, input.endX, input.endY);
    return {
        content: [{
            type: "text" as const,
            text: JSON.stringify({
                success: result.success,
                swipe: { from: { x: input.startX, y: input.startY }, to: { x: input.endX, y: input.endY } },
                ...(result.error ? { error: result.error } : {}),
            }),
        }],
    };
}
