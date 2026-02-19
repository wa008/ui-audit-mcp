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
            "Check for any UI elements that overlap or obscure each other. Crucially, verify that interactions and content respect system safe areas (status bar at top, home indicator at bottom) and rounded corners. No essential content should be cut off or covered.",
        scoringGuide:
            "1 = severe overlap/cut-off, 2 = noticeable overlap, 3 = minor overlap/safe-area issue, 4 = good, 5 = perfect spacing and safe-area adherence",
    },
    {
        id: "layout",
        name: "Layout & Screen Utilization",
        description:
            "Evaluate effective use of screen real estate. The app should fill the available screen size appropriate for the device (no unintended letterboxing/black bars). Elements should be balanced, with consistent alignment and spacing.",
        scoringGuide:
            "1 = severe layout issues (e.g. not full screen), 2 = poor structure, 3 = acceptable, 4 = good balance, 5 = professional and polished",
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
