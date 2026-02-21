import crypto from "crypto";
import { readLog, writeLog } from "../logger/audit-log.js";
import { DIMENSIONS, REQUIRED_DIMS } from "./checklist.js";

function generateToken(): string {
    return "tok_" + crypto.randomBytes(4).toString("hex");
}

export function getPendingTaskState(caseName: string, stepIndex: number) {
    const log = readLog(caseName);
    if (!log) {
        throw new Error(`Test case not found: ${caseName}`);
    }

    const step = log.steps[stepIndex];
    if (!step) {
        throw new Error(`Step ${stepIndex} not found in case ${caseName}`);
    }

    if (step.currentDimIndex >= REQUIRED_DIMS.length) {
        return {
            completed: true,
            message: `All ${REQUIRED_DIMS.length} dimensions for Step ${stepIndex} are fully evaluated! You may now proceed to interact with the device further (e.g. tap, swipe) or call get_audit_status.`
        };
    }

    // Generate a token if there isn't one
    if (!step.evaluationToken) {
        step.evaluationToken = generateToken();
        writeLog(log);
    }

    const currentDimId = REQUIRED_DIMS[step.currentDimIndex];
    const criteria = DIMENSIONS.find(d => d.id === currentDimId);

    if (!criteria) {
        throw new Error(`Dimension '${currentDimId}' not found.`);
    }

    return {
        completed: false,
        dimensionId: currentDimId,
        dimensionName: criteria.name,
        description: criteria.description,
        scoringGuide: criteria.scoringGuide,
        token: step.evaluationToken,
        stepIndex: stepIndex
    };
}

export function validateAndAdvanceState(caseName: string, stepIndex: number, token: string, score: number, reason: string) {
    const log = readLog(caseName);
    if (!log) {
        throw new Error(`Test case not found: ${caseName}`);
    }

    const step = log.steps[stepIndex];
    if (!step) {
        throw new Error(`Step ${stepIndex} not found in case ${caseName}`);
    }

    if (step.currentDimIndex >= REQUIRED_DIMS.length) {
        throw new Error(`Step ${stepIndex} is already fully evaluated.`);
    }

    if (!step.evaluationToken || step.evaluationToken !== token) {
        throw new Error("Invalid token. Do not guess tokens or run multiple submissions at once.");
    }

    const currentDimId = REQUIRED_DIMS[step.currentDimIndex];

    // Record the score
    step.evaluations[currentDimId] = {
        score,
        reason,
    };

    // Advance the state
    step.currentDimIndex += 1;

    // Clear the old token and generate a new one if not completed
    if (step.currentDimIndex < REQUIRED_DIMS.length) {
        step.evaluationToken = generateToken();
    } else {
        step.evaluationToken = undefined;
    }

    writeLog(log);

    return {
        completedDimId: currentDimId,
        score,
        nextState: getPendingTaskState(caseName, stepIndex)
    };
}
