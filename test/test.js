var plugin = require('../lib/index.js');
var assert = require('chai').assert;

describe('plugin', function() {

    describe('structure', function() {
        it('should contain processors object', function() {
            assert.property(plugin, 'processors', '.processors property is not defined');
        });
        it('should contain .lang property', function() {
            assert.property(plugin.processors, '.lang', '.lang property is not defined');
        });
        it('should contain .lang.preprocess property', function() {
            assert.property(plugin.processors['.lang'], 'preprocess',
                '.lang.preprocess is not defined');
        });
        it('should contain .lang.postprocess property', function() {
            assert.property(plugin.processors['.lang'], 'postprocess',
                '.lang.postprocess is not defined');
        });
    });

    describe('postprocess', function() {
        var preprocess = plugin.processors['.lang'].preprocess;
        var postprocess = plugin.processors['.lang'].postprocess;
        var singleQuotes = {
            fileName: 'singleQuotes.lang',
            text: "{'x': 0}"
        };
        var trailingCommas = {
            fileName: 'trailing.lang',
            text: '{ "x": 0, }'
        };
        var multipleErrors = {
            fileName: 'multipleErrors.lang',
            text: '{ x: 200, \'what\': 0 }'
        };
        var trailingText = {
            fileName: 'trailingtext.lang',
            text: '{ "my_string": "hello world" }' + ' \n' +  'bad_text'
        };
        var noID = {
            fileName: 'noID.lang',
            text: '{"_author":"b@houzz.com","GREETING":"Hello"}'
        };
        var noAuthor = {
            fileName: 'noAuthor.lang',
            text: '{"_id":"d318cb057308c97f8e5ec46a8a846648","GREETING":"Hello"}'
        };
        var emptyID = {
            fileName: 'emptyID.lang',
            text: '{"_id":"","_author":"b@houzz.com","GREETING":"Hello"}'
        };
        var emptyAuthor = {
            fileName: 'emptyAuthor.lang',
            text: '{"_id":"d318cb057308c97f8e5ec46a8a846648","_author":"","GREETING":"Hello"}'
        };
        var badEmail = {
            fileName: 'badEmail.lang',
            text: '{"_id":"d318cb057308c97f8e5ec46a8a846648","_author":"brett","GREETING":"Hello"}'
        };
        var valid = {
            fileName: 'valid.lang',
            text: '{"_id":"d318cb057308c97f8e5ec46a8a846648","_author":"b@houzz.com","GREETING":"Hello"}'
        };

        preprocess(singleQuotes.text, singleQuotes.fileName);
        preprocess(trailingCommas.text, trailingCommas.fileName);
        preprocess(multipleErrors.text, multipleErrors.fileName);
        preprocess(trailingText.text, trailingText.fileName);
        preprocess(valid.text, valid.fileName);
        preprocess(noAuthor.text, noAuthor.fileName);
        preprocess(noID.text, noID.fileName);
        preprocess(emptyID.text, emptyID.fileName);
        preprocess(emptyAuthor.text, emptyAuthor.fileName);
        preprocess(badEmail.text, badEmail.fileName);

        it('should return an error for the single quotes', function() {
            var errors = postprocess([], singleQuotes.fileName);
            assert.isArray(errors, 'should return an array');
            assert.lengthOf(errors, 1, 'should return one error');

            var error = errors[0];
            assert.strictEqual(error.line, 1, 'should point to first line');
            assert.strictEqual(error.column, 2, 'should point to second character');
        });

        it('should return an error for trailing commas', function() {
            var errors = postprocess([], trailingCommas.fileName);
            assert.isArray(errors, 'should return an array');
            assert.lengthOf(errors, 1, 'should return one error');

            var error = errors[0];
            assert.strictEqual(error.line, 1, 'should point to the first line');
            assert.strictEqual(error.column, 9, 'should point to the 9th character');
        });

        it('should report unrecoverable syntax error', function() {
            var errors = postprocess([], trailingText.fileName);
            assert.isArray(errors, 'should return an array');
            assert.lengthOf(errors, 1, 'should return one error');
            assert.isString(errors[0].message, 'should have a valid message');
        });

        it('should return multiple errors for multiple errors', function() {
            var errors = postprocess([], multipleErrors.fileName);
            assert.isArray(errors, 'should return an array');
            assert.lengthOf(errors, 2, 'should return one error');
        });

        it('error when no "_id" field exists', function() {
            var errors = postprocess([], noID.fileName);
            assert.deepEqual(errors, [plugin.NO_ID_ERROR]);
        });

        it('error when no "_author" field exists', function() {
            var errors = postprocess([], noAuthor.fileName);
            assert.deepEqual(errors, [plugin.NO_AUTHOR_ERROR]);
        });

        it('error when "_id" is empty', function() {
            var errors = postprocess([], emptyID.fileName);
            assert.deepEqual(errors, [plugin.NO_ID_ERROR]);
        });

        it('error when "_author" is empty', function() {
            var errors = postprocess([], emptyAuthor.fileName);
            assert.deepEqual(errors, [plugin.NO_AUTHOR_ERROR]);
        });

        it('error when "_author" is invalid email', function() {
            var errors = postprocess([], badEmail.fileName);
            assert.deepEqual(errors, [plugin.INVALID_AUTHOR_ERROR]);
        });

        it('should return no errors for valid lang file', function() {
            var errors = postprocess([], valid.fileName);
            assert.deepEqual(errors, [], 'valid lang file shouldnt have any errors');
        });
    });
});
