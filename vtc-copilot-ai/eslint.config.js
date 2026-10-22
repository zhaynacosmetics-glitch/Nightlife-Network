import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist", ".ssr", ".wrangler", "node_modules", "video/node_modules", "video/out", "test-results", "playwright-report"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // Espaces insécables volontaires (typographie française)
      "no-irregular-whitespace": ["error", { skipStrings: true, skipTemplates: true, skipJSXText: true }],
    },
  },
  { files: ["scripts/**", "video/scripts/**", "*.config.*", "tests/**"], languageOptions: { globals: { ...globals.node } } },
  { files: ["**/*.cjs"], rules: { "@typescript-eslint/no-require-imports": "off" }, languageOptions: { globals: { ...globals.node }, sourceType: "commonjs" } },
);
