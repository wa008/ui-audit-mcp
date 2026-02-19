/**
 * Device adapter using idb + xcrun simctl.
 *
 * Dependencies:
 *   - xcrun simctl (ships with Xcode CLI tools) → launch app, screenshot
 *   - idb (Facebook's iOS Development Bridge)    → tap, swipe
 *
 * Install idb:
 *   brew install idb-companion
 *   pip3 install fb-idb
 *
 * Coordinates use the iOS points system. The adapter accepts ratio
 * coordinates (0-1) and converts them using the screen dimensions
 * obtained from the screenshot.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";

const execFileAsync = promisify(execFile);
const SCREENSHOT_DIR = path.join(os.homedir(), ".ui-audit-mcp", "screenshots");

function ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Read PNG width and height from the IHDR chunk (bytes 16-23). */
function readPngDimensions(filePath: string): { width: number; height: number } {
    const buf = Buffer.alloc(24);
    const fd = fs.openSync(filePath, "r");
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const IDB_INSTALL_HINT =
    "idb is required for tap/swipe. Install it with:\n" +
    "  brew install idb-companion\n" +
    "  pip3 install fb-idb\n" +
    "See https://fbidb.io for details.";

/** Check that required CLI tools are available. */
export async function preflight(): Promise<{ ok: boolean; missing: string[] }> {
    const missing: string[] = [];
    try {
        await execFileAsync("xcrun", ["simctl", "list", "devices", "booted"]);
    } catch {
        missing.push("xcrun simctl (install Xcode Command Line Tools)");
    }
    try {
        await execFileAsync("idb", ["--help"]);
    } catch {
        missing.push(`idb (${IDB_INSTALL_HINT})`);
    }
    return { ok: missing.length === 0, missing };
}

// ─── Public API ──────────────────────────────────────────

/** Launch an app by bundle ID on the booted simulator. */
export async function launchApp(
    appId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await execFileAsync("xcrun", ["simctl", "launch", "booted", appId]);
        return { success: true };
    } catch (err: unknown) {
        const e = err as { stderr?: string; message?: string };
        return { success: false, error: e.stderr ?? e.message ?? String(err) };
    }
}

/** Take a screenshot and return base64 PNG + dimensions. */
export async function takeScreenshot(): Promise<{
    imageBase64: string;
    width: number;
    height: number;
    filePath: string;
}> {
    ensureDir(SCREENSHOT_DIR);
    const filePath = path.join(SCREENSHOT_DIR, `${randomUUID()}.png`);

    try {
        await execFileAsync("xcrun", ["simctl", "io", "booted", "screenshot", filePath]);
    } catch (err: unknown) {
        const e = err as { stderr?: string; message?: string };
        throw new Error(`Screenshot failed: ${e.stderr ?? e.message}`);
    }

    const { width, height } = readPngDimensions(filePath);
    const imageBase64 = fs.readFileSync(filePath).toString("base64");
    return { imageBase64, width, height, filePath };
}

/** Tap at ratio coordinates (0-1). Converts to points using screen size. */
export async function tap(
    ratioX: number,
    ratioY: number
): Promise<{ success: boolean; pointX: number; pointY: number; error?: string }> {
    const { width, height } = await getScreenSize();
    const pointX = Math.round(ratioX * width);
    const pointY = Math.round(ratioY * height);

    try {
        await execFileAsync("idb", ["ui", "tap", String(pointX), String(pointY)]);
        return { success: true, pointX, pointY };
    } catch (err: unknown) {
        const e = err as { stderr?: string; message?: string; code?: string };
        if (e.code === "ENOENT") {
            return { success: false, pointX, pointY, error: IDB_INSTALL_HINT };
        }
        return { success: false, pointX, pointY, error: e.stderr ?? e.message ?? String(err) };
    }
}

/** Swipe using ratio coordinates (0-1). */
export async function swipe(
    startX: number,
    startY: number,
    endX: number,
    endY: number
): Promise<{ success: boolean; error?: string }> {
    const { width, height } = await getScreenSize();
    const x1 = Math.round(startX * width);
    const y1 = Math.round(startY * height);
    const x2 = Math.round(endX * width);
    const y2 = Math.round(endY * height);

    try {
        await execFileAsync("idb", [
            "ui", "swipe", String(x1), String(y1), String(x2), String(y2),
        ]);
        return { success: true };
    } catch (err: unknown) {
        const e = err as { stderr?: string; message?: string; code?: string };
        if (e.code === "ENOENT") {
            return { success: false, error: IDB_INSTALL_HINT };
        }
        return { success: false, error: e.stderr ?? e.message ?? String(err) };
    }
}

// ─── Internal ────────────────────────────────────────────

let cachedScreenSize: { width: number; height: number } | null = null;

/** Get screen size by taking a quick screenshot and reading its dimensions. */
async function getScreenSize(): Promise<{ width: number; height: number }> {
    if (cachedScreenSize) return cachedScreenSize;
    const result = await takeScreenshot();
    cachedScreenSize = { width: result.width, height: result.height };
    // Clean up the temp screenshot — it was only needed for dimensions
    try { fs.unlinkSync(result.filePath); } catch { /* ignore */ }
    return cachedScreenSize;
}

