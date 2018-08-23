var service = require('./service.js');

exports.hello = function(req, res) {
   res.writeHead(200, {'Content-Type': 'text/plain'});
   res.end( service.hello() );
}