require('./_create_test_db.js');
var test = require('tape');
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection();
server.register({ register: require('../index.js') }, function(err) {
  console.log(err);
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    var q = 'SELECT * FROM logs ORDER BY log_timestamp DESC LIMIT 1';
    request.pg.client.query(q, function(err, result) {
      console.log(err, result.rows)
      return reply(result.rows[0]);
    });
  }
});

server.start(function() {
  console.log('Visit: http://127.0.0.1:'+server.info.port);
});

test.only('GET / as fast as you can!', function (t) {
  var options = { method: 'GET', url: '/' };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, '/ visited ');
    server.stop(function(){});
    t.end();
  });
});
