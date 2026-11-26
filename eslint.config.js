import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

// O ESLint identifica referências JavaScript, mas não conta nomes de
// componentes em tags JSX como uso de variáveis sem uma regra adicional.
const jsx = {
  rules: {
    "uses-vars": {
      meta: { type: "problem", schema: [] },
      create(context) {
        return {
          JSXOpeningElement(node) {
            let nome = node.name;
            while (nome.type === "JSXMemberExpression") nome = nome.object;
            if (nome.type === "JSXIdentifier" &&
                (node.name.type === "JSXMemberExpression" || /^[A-Z]/.test(nome.name))) {
              context.sourceCode.markVariableAsUsed(nome.name, node);
            }
          },
        };
      },
    },
  },
};

export default [
  { ignores: ["dist"] },
  {
    ...js.configs.recommended,
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
    plugins: {
      "jsx": jsx,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "jsx/uses-vars": "error",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    // O index.jsx centraliza as rotas e a montagem do React, como no Bloom Aluno.
    files: ["src/index.jsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    files: ["*.config.{js,mjs}"],
    languageOptions: { globals: globals.node },
  },
];
