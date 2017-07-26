var path = require('path');
var fs = require('fs');

/**
 * Creates a new `Templator` instance.
 * 
 * @name Templator
 * @function
 * @param {Object} options An object containing the following fields:
 * 
 *  - `templateFile` {String}: Path to template file to use
 */
var Templator = function(options) {
  if(typeof options === 'string') {
    options = {
      templateFile: options,
    };
  }
  
  if(typeof options.templateFile !== 'string') {
    throw new Error('No template file provided');
  }
  
  options.templateFile = path.resolve(options.templateFile);
  
  this.template = fs.readFileSync(options.templateFile).toString();
  this.options = options;
};

/**
 * Run the contents of an HTML file through the `Templator`.
 * 
 * @name processFile
 * @function
 * @param {String} contentFile Path to HTML file to be processed
 * @return {String} The processed HTML
 */
Templator.prototype.processFile = function(contentFile) {
  return this.processContent(fs.readFileSync(contentFile).toString());
};

/**
 * Generate HTML from template file and content file
 * 
 * @name processContent
 * @function
 * @param {String} content HTML content to be used in template
 * @return {String} The processed HTML
 */
Templator.prototype.processContent = function(content) {
  var regMark = new RegExp('{{\\s*([^\\s]+)\\s*}}', 'g');
  
  function genRegex(name) {
    return new RegExp(
      '{{\\s*' + name + '\\s*}}' +
      '((.|[\\r\\n])+)' +
      '{{\\s*\\/' + name + '\\s*}}'
    );
  }
  
  return this.template.replace(regMark, function(match, name) {
    var find = content.match(genRegex(name));
    return find ? find[1] : match;
  });
};

module.exports = Templator;
