/**
 * api/pages.js
 *
 * sections separated by folders
 */

'use strict';

var Pages = {
  index: function(req, res, next)  {
    res.render('index');
  },
  error: function(req, res, next) {
    res.render('error');
    var name = req.params.name;
  },
  partials: function (req, res) {
    var name = req.params.name;
    console.log(name)
    if(name === 'nav') {
      res.render('includes/' + name );
    }
    else{
      res.render('partials/' + name );
    }
  },
  users: function (req, res) {
    var name = req.params.name;

    res.render('users/' + name );
  },

};


module.exports = Pages;
