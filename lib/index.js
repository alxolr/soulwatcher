'use strict';

function tokenizeDeadCode(buf) {
  return buf.toString('utf8').split('\n');
}

module.exports = {
  tokenizeDeadCode,
};
