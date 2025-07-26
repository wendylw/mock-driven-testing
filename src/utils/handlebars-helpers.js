const Handlebars = require('handlebars');

// Register custom Handlebars helpers
Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context, null, 2);
});

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

module.exports = Handlebars;