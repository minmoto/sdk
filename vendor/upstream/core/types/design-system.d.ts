/**
 * Minmo Design System Constants
 * Shared across all Minmo applications
 */
export declare const COLORS: {
    readonly brand: {
        readonly orange: {
            readonly 50: "#fff7ed";
            readonly 100: "#ffedd5";
            readonly 200: "#fed7aa";
            readonly 300: "#fdba74";
            readonly 400: "#fb923c";
            readonly 500: "#ff8500";
            readonly 600: "#ff5800";
            readonly 700: "#c2410c";
            readonly 800: "#9a3412";
            readonly 900: "#7c2d12";
        };
        readonly green: {
            readonly 50: "#f0fdf4";
            readonly 100: "#dcfce7";
            readonly 200: "#bbf7d0";
            readonly 300: "#86efac";
            readonly 400: "#4ade80";
            readonly 500: "#22c55e";
            readonly 600: "#16a34a";
            readonly 700: "#15803d";
            readonly 800: "#166534";
            readonly 900: "#14532d";
        };
    };
    readonly neutral: {
        readonly 0: "#ffffff";
        readonly 50: "#fafafa";
        readonly 100: "#f4f4f5";
        readonly 200: "#e4e4e7";
        readonly 300: "#d4d4d8";
        readonly 400: "#a1a1aa";
        readonly 500: "#71717a";
        readonly 600: "#52525b";
        readonly 700: "#3f3f46";
        readonly 800: "#27272a";
        readonly 900: "#18181b";
        readonly 950: "#0a0a0a";
    };
    readonly semantic: {
        readonly background: {
            readonly primary: "#0a0a0a";
            readonly secondary: "#1a1a1a";
            readonly tertiary: "#2a2a2a";
        };
        readonly text: {
            readonly primary: "#ededed";
            readonly secondary: "#a1a1aa";
            readonly muted: "#71717a";
        };
        readonly border: {
            readonly DEFAULT: "rgba(255, 255, 255, 0.1)";
            readonly hover: "rgba(255, 255, 255, 0.2)";
        };
        readonly primary: "#ff8500";
        readonly success: "#4ade80";
        readonly error: "#ef4444";
        readonly warning: "#f59e0b";
        readonly info: "#3b82f6";
    };
};
export declare const TYPOGRAPHY: {
    readonly fontFamily: {
        readonly sans: readonly ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"];
        readonly mono: readonly ["JetBrains Mono", "Menlo", "Monaco", "Consolas", "monospace"];
    };
    readonly fontSize: {
        readonly xs: "0.75rem";
        readonly sm: "0.875rem";
        readonly base: "1rem";
        readonly lg: "1.125rem";
        readonly xl: "1.25rem";
        readonly "2xl": "1.5rem";
        readonly "3xl": "1.875rem";
        readonly "4xl": "2.25rem";
        readonly "5xl": "3rem";
    };
    readonly fontWeight: {
        readonly normal: 400;
        readonly medium: 500;
        readonly semibold: 600;
        readonly bold: 700;
    };
    readonly lineHeight: {
        readonly none: 1;
        readonly tight: 1.25;
        readonly normal: 1.5;
        readonly relaxed: 1.625;
    };
};
export declare const SPACING: {
    readonly px: "1px";
    readonly 0: "0";
    readonly 0.5: "0.125rem";
    readonly 1: "0.25rem";
    readonly 1.5: "0.375rem";
    readonly 2: "0.5rem";
    readonly 2.5: "0.625rem";
    readonly 3: "0.75rem";
    readonly 3.5: "0.875rem";
    readonly 4: "1rem";
    readonly 5: "1.25rem";
    readonly 6: "1.5rem";
    readonly 7: "1.75rem";
    readonly 8: "2rem";
    readonly 9: "2.25rem";
    readonly 10: "2.5rem";
    readonly 12: "3rem";
    readonly 14: "3.5rem";
    readonly 16: "4rem";
    readonly 20: "5rem";
};
export declare const RADII: {
    readonly none: "0";
    readonly sm: "0.375rem";
    readonly DEFAULT: "0.5rem";
    readonly md: "0.75rem";
    readonly lg: "1rem";
    readonly xl: "1.5rem";
    readonly "2xl": "2rem";
    readonly full: "9999px";
};
export declare const SHADOWS: {
    readonly none: "none";
    readonly sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
    readonly DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
    readonly md: "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
    readonly lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
    readonly xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
    readonly "dark-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.3)";
    readonly "dark-md": "0 10px 15px -3px rgba(0, 0, 0, 0.4)";
    readonly "dark-lg": "0 20px 25px -5px rgba(0, 0, 0, 0.5)";
};
export declare const Z_INDEX: {
    readonly auto: "auto";
    readonly 0: 0;
    readonly 10: 10;
    readonly 20: 20;
    readonly 30: 30;
    readonly 40: 40;
    readonly 50: 50;
    readonly dropdown: 1000;
    readonly modal: 1050;
    readonly popover: 1100;
    readonly tooltip: 1150;
};
export declare const TRANSITIONS: {
    readonly duration: {
        readonly fast: "150ms";
        readonly base: "200ms";
        readonly slow: "300ms";
        readonly slower: "500ms";
    };
    readonly easing: {
        readonly DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)";
        readonly in: "cubic-bezier(0.4, 0, 1, 1)";
        readonly out: "cubic-bezier(0, 0, 0.2, 1)";
        readonly inOut: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
};
export declare const BREAKPOINTS: {
    readonly sm: "640px";
    readonly md: "768px";
    readonly lg: "1024px";
    readonly xl: "1280px";
    readonly "2xl": "1536px";
};
export type Color = typeof COLORS;
export type ColorKey = keyof Color;
export type Typography = typeof TYPOGRAPHY;
export type Spacing = typeof SPACING;
export type SpacingKey = keyof Spacing;
export type Radii = typeof RADII;
export type RadiiKey = keyof Radii;
export type Shadow = typeof SHADOWS;
export type ShadowKey = keyof Shadow;
//# sourceMappingURL=design-system.d.ts.map