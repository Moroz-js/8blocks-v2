import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";


// Two design systems live side by side (docs/design-system-v2.md):
// v1 — src/shared/ui + src/shared/styles, pages in src/app/(site);
// v2 — src/shared/ds, pages in src/app/(site-v2). They must not mix.
// Widgets, features and entities stay neutral; header/footer are shared via
// the chrome contract. SCSS @use is not covered here — see the docs.
const V1_MODULES = ["@/shared/ui", "@/shared/ui/*", "@/shared/styles", "@/shared/styles/*"];
const V2_MODULES = ["@/shared/ds", "@/shared/ds/*"];

const designSystemBoundaries = [
  {
    files: ["src/shared/ds/**", "src/app/\(site-v2\)/**"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: V1_MODULES, message: "Design system v2 must not use v1 UI/styles (src/shared/ui, src/shared/styles)." }],
      }],
    },
  },
  {
    files: ["src/shared/ui/**", "src/shared/styles/**", "src/app/\(site\)/**"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: V2_MODULES, message: "Design system v1 pages/components must not use v2 (src/shared/ds)." }],
      }],
    },
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...designSystemBoundaries,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
