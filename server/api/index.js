/**
 * api/index.js
 */

'use strict';

exports.error = function (req, res) {
  res.json({
    name: 'Error',
    message:'404 Not found'
  });
};



