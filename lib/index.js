/**
 * @fileoverview Lint JSON files
 * @author Azeem Bande-Ali
 * @copyright 2015 Azeem Bande-Ali. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var jshint = require("jshint");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


var fileContents = {};

var EmailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

var NO_ID_ERROR = {
    ruleid: "lang-no-id",
    severity: 2,
    message: "Required '_id' field missing or empty",
};

var NO_AUTHOR_ERROR = {
    ruleid: "lang-no-author",
    severity: 2,
    message: "Required '_author' field missing or empty",
};

var INVALID_AUTHOR_ERROR = {
    ruleid: "lang-author-invlaid",
    severity: 2,
    message: "'_author' field needs to be a valid email",
};

// import processors
module.exports.processors = {
    // add your processors here
    ".lang": {
        preprocess: function(text, fileName) {
            fileContents[fileName] = text;
            return [text];
        },
        postprocess: function(messages, fileName) {
            jshint.JSHINT(fileContents[fileName]);
            var data = jshint.JSHINT.data();
            var jsonErrors = (data && data.errors) || [];
            var errors = jsonErrors.filter(function(e){ return !!e; }).map(function(error) {
                return {
                    ruleid: "bad-json",
                    severity: 2,
                    message: error.reason,
                    source: error.evidence,
                    line: error.line,
                    column: error.character
                };
            });
            if (errors.length === 0) {
                var lang = JSON.parse(fileContents[fileName]);
                if (!lang._id) {
                    errors.push(NO_ID_ERROR);
                }
                if (!lang._author) {
                    errors.push(NO_AUTHOR_ERROR);
                } else {
                    if (!EmailRegex.test(lang._author)) {
                        errors.push(INVALID_AUTHOR_ERROR);
                    }
                }
            }
            delete fileContents[fileName];
            return errors;
        }
    }
};

module.exports.NO_ID_ERROR = NO_ID_ERROR;
module.exports.NO_AUTHOR_ERROR = NO_AUTHOR_ERROR;
module.exports.INVALID_AUTHOR_ERROR = INVALID_AUTHOR_ERROR;