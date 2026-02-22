import crypto from "crypto";
import { readLog, writeLog } from "../logger/audit-log.js";
import { DIMENSIONS, getRequiredDimsForStep } from "./checklist.js";

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

    const requiredDims = getRequiredDimsForStep(!!step.expectedOutcome);

    if (step.currentDimIndex >= requiredDims.length) {
        return {
            completed: true,
            message: `All ${requiredDims.length} dimensions for Step ${stepIndex} are fully evaluated! You may now proceed to interact with the device further (e.g. tap, swipe) or call get_audit_status.`
        };
    }

    if (!step.evaluationToken) {
        step.evaluationToken = generateToken();
        writeLog(log);
    }

    const currentDimId = requiredDims[step.currentDimIndex];
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
        stepIndex: stepIndex,
        progress: `${step.currentDimIndex + 1} / ${requiredDims.length}`,
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

    const requiredDims = getRequiredDimsForStep(!!step.expectedOutcome);

    if (step.currentDimIndex >= requiredDims.length) {
        throw new Error(`Step ${stepIndex} is already fully evaluated.`);
    }

    if (!step.evaluationToken || step.evaluationToken !== token) {
        throw new Error("Invalid token. Do not guess tokens or run multiple submissions at once.");
    }

    const currentDimId = requiredDims[step.currentDimIndex];

    step.evaluations[currentDimId] = {
        score,
        reason,
    };

    step.currentDimIndex += 1;

    if (step.currentDimIndex < requiredDims.length) {
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
