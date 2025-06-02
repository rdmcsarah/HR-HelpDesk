module.exports = {
  extends: ["next/core-web-vitals"],
  overrides: [
    {
      files: ["**/*.stories.tsx"],
      rules: {
        "storybook/no-renderer-packages": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "react/no-unescaped-entities": "off"
      }
    }
  ]
};
