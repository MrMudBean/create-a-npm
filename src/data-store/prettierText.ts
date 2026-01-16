/**  导出 prettier 的文本   */
export function prettierText() {
  return JSON.stringify(
    {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      bracketSpacing: true,
      arrowParens: 'avoid',
      endOfLine: 'auto',
    },
    null,
    2,
  );
}
