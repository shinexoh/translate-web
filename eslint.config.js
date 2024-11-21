import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    semi: true,
    overrides: {
      /**
       * 在对象字面量中
       * 如果属性名是合法的标识符 则使用标识符作为属性名 否则使用引号作为属性名
       */
      'style/quote-props': ['error', 'as-needed', { numbers: true }],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    },
  },
  react: true,
  jsonc: false,
  yaml: false,
  toml: false,
  markdown: false,
});
