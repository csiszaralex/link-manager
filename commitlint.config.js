module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['api', 'worker', 'web', 'repo', 'ci', 'release'],
    ],
    'scope-empty': [2, 'never'],
  },
};
