# eslint-plugin-lang

[ESLint](http://eslint.org) plugin for linting `.lang` JSON files.

Ensures proper JSON formatting and a valid _id and _author field in each file.

## Installation

Next, install `eslint-plugin-lang`:

```
$ npm install git+https://git@github.com/brett-hobbs/eslint-plugin-lang.git --save-dev

$ yarn add --dev git+https://git@github.com/brett-hobbs/eslint-plugin-lang.git
```

## Usage

Add `lang` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```lang
{
    "plugins": [
        "lang"
    ]
}
```
