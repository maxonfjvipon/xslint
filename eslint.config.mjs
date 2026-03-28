/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("google"),

    languageOptions: {
        globals: {},
        ecmaVersion: 2019,
        sourceType: "script",
    },

    rules: {
        semi: "off",
        "comma-dangle": "off",
        indent: ["error", 2],
        camelcase: "off",
        "valid-jsdoc": "off",

        "max-len": ["error", {
            code: 300,
        }],
    },
}]);