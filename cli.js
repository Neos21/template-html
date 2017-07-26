var Templator = require('./');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

module.exports = function(options) {
  var template = new Templator({
    templateFile: options.templateFile
  });
  
  options.files.forEach(function(file) {
    var content = template.processFile(file);
    var filepath = path.resolve(options.output, options.preserveTree ? file : path.basename(file));
    
    mkdirp.sync(path.dirname(filepath));
    fs.writeFileSync(filepath, content);
  });
};
