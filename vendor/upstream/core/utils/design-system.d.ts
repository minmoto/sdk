/**
 * Design System Utilities
 * Helper functions for using design tokens across different styling solutions
 */
import { SPACING, RADII } from "../types/design-system";
/**
 * Generate CSS custom properties from design tokens
 * Usage: Add to your global CSS or inject via style tag
 */
export declare function generateCSSVariables(): string;
/**
 * Tailwind CSS configuration preset
 * Usage: import in your tailwind.config.js
 */
export declare const tailwindPreset: {
    theme: {
        extend: {
            colors: {
                brand: {
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
                neutral: {
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
                primary: "#ff8500";
                success: "#4ade80";
                error: "#ef4444";
                warning: "#f59e0b";
                info: "#3b82f6";
                background: {
                    readonly primary: "#0a0a0a";
                    readonly secondary: "#1a1a1a";
                    readonly tertiary: "#2a2a2a";
                };
                text: {
                    readonly primary: "#ededed";
                    readonly secondary: "#a1a1aa";
                    readonly muted: "#71717a";
                };
            };
            fontFamily: {
                readonly sans: readonly ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"];
                readonly mono: readonly ["JetBrains Mono", "Menlo", "Monaco", "Consolas", "monospace"];
            };
            fontSize: {
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
            spacing: {
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
            borderRadius: {
                readonly none: "0";
                readonly sm: "0.375rem";
                readonly DEFAULT: "0.5rem";
                readonly md: "0.75rem";
                readonly lg: "1rem";
                readonly xl: "1.5rem";
                readonly "2xl": "2rem";
                readonly full: "9999px";
            };
            boxShadow: {
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
        };
    };
};
/**
 * Material-UI theme configuration helper
 * Usage: Merge with your MUI theme
 */
export declare const muiThemeOptions: {
    palette: {
        primary: {
            main: "#ff8500";
            light: "#fb923c";
            dark: "#ff5800";
        };
        success: {
            main: "#4ade80";
            light: "#86efac";
            dark: "#22c55e";
        };
        error: {
            main: "#ef4444";
        };
        warning: {
            main: "#f59e0b";
        };
        info: {
            main: "#3b82f6";
        };
        background: {
            default: "#0a0a0a";
            paper: "#1a1a1a";
        };
        text: {
            primary: "#ededed";
            secondary: "#a1a1aa";
        };
        divider: "rgba(255, 255, 255, 0.1)";
    };
    typography: {
        fontFamily: string;
        fontSize: number;
        fontWeightLight: 400;
        fontWeightRegular: 400;
        fontWeightMedium: 500;
        fontWeightBold: 700;
    };
    shape: {
        borderRadius: number;
    };
    shadows: string[];
};
/**
 * Get a specific color value by path
 * Usage: getColor('brand.orange.500') => '#ff8500'
 */
export declare function getColor(path: string): string;
/**
 * Get spacing value
 * Usage: getSpacing(4) => '1rem'
 */
export declare function getSpacing(key: keyof typeof SPACING): string;
/**
 * Get radius value
 * Usage: getRadius('lg') => '1rem'
 */
export declare function getRadius(key: keyof typeof RADII): string;
//# sourceMappingURL=design-system.d.ts.map