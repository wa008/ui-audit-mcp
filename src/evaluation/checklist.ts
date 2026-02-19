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
            "Check for any UI elements that overlap or obscure each other. CRITICAL CHECK: Look at the top status bar (time, battery, signal). Does the app header or any button overlap with these system icons? This is a severe failure. Also check rounded corners and the bottom home indicator area. Even a 1 pixel overlap is a failure.",
        scoringGuide:
            "0-3 = obvious overlap/cut-off or safe area violation, 4-6 = minor overlap but functional, 7-8 = no overlap but spacing is tight, 9-10 = perfect spacing and safe-area adherence",
    },
    {
        id: "layout",
        name: "Layout & Screen Utilization",
        description:
            "Evaluate specific screen utilization. CRITICAL FAILURE CHECK: Does the app appear to be running in a 'box' with large black/empty bars at the top and bottom (letterboxing)? This often happens when an old app runs on a new device. If seen, Score must be 0. Also check for unbalanced whitespace. The app MUST fill the entire screen naturally.",
        scoringGuide:
            "0-3 = letterboxing detected / severe layout issues, 4-6 = poor structure or unbalanced whitespace, 7-8 = acceptable but lacks polish, 9-10 = perfect screen utilization and balance",
    },
    {
        id: "info_clarity",
        name: "Information Clarity",
        description:
            "Check whether the user can quickly identify key information on this screen, whether the information hierarchy is clear, and whether the primary call-to-action (CTA) is prominent.",
        scoringGuide:
            "0-3 = key information is impossible to find or confusing, 4-6 = readable but requires effort to understand, 7-8 = clear but hierarchy could be better, 9-10 = excellent, immediate clarity",
    },
    {
        id: "ambiguity",
        name: "Expression Ambiguity",
        description:
            "Check whether any copy, icons, or button labels are ambiguous or misleading, and whether the intended action is clearly communicated to the user.",
        scoringGuide:
            "0-3 = severely ambiguous / misleading, 4-6 = multiple minor ambiguities, 7-8 = generally clear with 1-2 minor issues, 9-10 = precise, unambiguous, and intuitive",
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
            "0-3 = completely different styles or clashing colors, 4-6 = noticeable inconsistencies, 7-8 = mostly consistent but minor deviations, 9-10 = perfectly unified color scheme",
    },
    {
        id: "component_consistency",
        name: "Component Style Consistency",
        description:
            "Compare buttons, navigation bars, cards, and other reusable components across all screenshots to verify they share the same visual style (corner radius, shadow, spacing, etc.).",
        scoringGuide:
            "0-3 = every screen looks different or core components vary wildly, 4-6 = noticeable differences in component design, 7-8 = mostly consistent, 9-10 = strict adherence to a unified design system",
    },
    {
        id: "typography_consistency",
        name: "Typography Consistency",
        description:
            "Compare heading sizes, body text sizes, font weights, and line spacing across all screenshots to verify consistency.",
        scoringGuide:
            "0-3 = chaotic typography or mixing incompatible fonts, 4-6 = noticeable differences in scaling or weights, 7-8 = mostly consistent, 9-10 = strictly unified typography system",
    },
];

/** Default passing score for each checklist item (on a 0-10 scale). The standard is now higher. */
export const DEFAULT_PASSING_SCORE = 8;
