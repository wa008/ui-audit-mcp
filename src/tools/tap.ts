/**
 * Tool: tap
 * Tap at a position on the simulator screen using ratio coordinates (0-1).
 */

import { z } from "zod";
import * as device from "../device/adapter.js";

export const tapSchema = z.object({
    x: z.number().min(0).max(1).describe("Horizontal position ratio (0 = left, 1 = right)"),
    y: z.number().min(0).max(1).describe("Vertical position ratio (0 = top, 1 = bottom)"),
});

export async function tap(input: z.infer<typeof tapSchema>) {
    const result = await device.tap(input.x, input.y);
    return {
        content: [{
            type: "text" as const,
            text: JSON.stringify({
                success: result.success,
                tappedAt: { ratioX: input.x, ratioY: input.y, pointX: result.pointX, pointY: result.pointY },
                ...(result.error ? { error: result.error } : {}),
            }),
        }],
    };
}
