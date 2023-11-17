module.exports = {
    parser: 'vue-eslint-parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        extraFileExtensions: ['.vue']
    },
    env: {
        node: true,
        commonjs: true,
        browser: true,
        es6: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/essential',
        '@vue/eslint-config-prettier',
        'prettier'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/multi-word-component-names': 0,
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto'
            }
        ]
    }
};
