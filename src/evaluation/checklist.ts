/**
 * Evaluation checklist definitions.
 *
 * Screen evaluation: 4 items (overlap, layout, info clarity, ambiguity)
 * Style consistency: 3 items (color, component, typography)
 */

import { ChecklistItem } from "../types.js";

/** Single-screen UI quality checklist */
export const SCREEN_CHECKLIST: ChecklistItem[] = [
    {
        id: "overlap",
        name: "Element Overlap & Safe Areas",
        description:
            "Check for any UI elements that overlap or obscure each other. CRITICAL CHECK: Look at the top status bar (time, battery, signal). Does the app header or any button overlap with these system icons? This is a severe failure. Also check rounded corners and the bottom home indicator area.",
        scoringGuide:
            "1 = content overlaps status bar or other elements, 2 = noticeable overlap, 3 = minor safe-area issue, 4 = good, 5 = perfect spacing and safe-area adherence",
    },
    {
        id: "layout",
        name: "Layout & Screen Utilization",
        description:
            "Evaluate specific screen utilization. CRITICAL FAILURE CHECK: Does the app appear to be running in a 'box' with large black/empty bars at the top and bottom (letterboxing)? This often happens when an old app runs on a new device. If seen, Score must be 1. Also check for unbalanced whitespace.",
        scoringGuide:
            "1 = letterboxing detected (black bars top/bottom) / severe layout issues, 2 = poor structure, 3 = acceptable, 4 = good balance, 5 = professional and polished",
    },
    {
        id: "info_clarity",
        name: "Information Clarity",
        description:
            "Check whether the user can quickly identify key information on this screen, whether the information hierarchy is clear, and whether the primary call-to-action (CTA) is prominent.",
        scoringGuide:
            "1 = key information is impossible to find, 2 = confusing, 3 = readable but not ideal, 4 = clear, 5 = excellent hierarchy",
    },
    {
        id: "ambiguity",
        name: "Expression Ambiguity",
        description:
            "Check whether any copy, icons, or button labels are ambiguous or misleading, and whether the intended action is clearly communicated to the user.",
        scoringGuide:
            "1 = severely ambiguous / misleading, 2 = multiple ambiguities, 3 = minor ambiguity, 4 = clear, 5 = precise and unambiguous",
    },
];

/** Multi-screen style-consistency checklist */
export const STYLE_CHECKLIST: ChecklistItem[] = [
    {
        id: "color_consistency",
        name: "Color Scheme Consistency",
        description:
            "Compare all provided screenshots and check whether the primary colors, accent colors, and background colors are consistent across screens.",
        scoringGuide:
            "1 = completely different styles, 2 = noticeable inconsistencies, 3 = mostly consistent, 4 = well unified, 5 = perfectly unified",
    },
    {
        id: "component_consistency",
        name: "Component Style Consistency",
        description:
            "Compare buttons, navigation bars, cards, and other reusable components across all screenshots to verify they share the same visual style (corner radius, shadow, spacing, etc.).",
        scoringGuide:
            "1 = every screen looks different, 2 = noticeable differences, 3 = mostly consistent, 4 = well unified, 5 = strict design system",
    },
    {
        id: "typography_consistency",
        name: "Typography Consistency",
        description:
            "Compare heading sizes, body text sizes, font weights, and line spacing across all screenshots to verify consistency.",
        scoringGuide:
            "1 = chaotic typography, 2 = noticeable differences, 3 = mostly consistent, 4 = well unified, 5 = strictly unified",
    },
];

/** Default passing score for each checklist item (on a 1-5 scale) */
export const DEFAULT_PASSING_SCORE = 3;
