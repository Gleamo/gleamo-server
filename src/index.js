var amqp = require('amqplib/callback_api');
var config = require('../config.json');

var authority = '';

if (config.mq.username) {
  authority = config.mq.username;

  if (config.mq.password) {
    authority += ':' + config.mq.password;
  }

  authority += '@';
}


var url = 'amqp://' + authority + config.mq.host;

if (config.mq.port) {
  url += ':' + config.mq.port;
}

if (config.mq.vhost) {
  url += '/' + config.mq.vhost;
}

amqp.connect(url, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = config.mq.queue_name;
    var msg = {
      commands: [
        {
          duration: 1000,
          start_offset: 0,
          end_offset: 0,
          color: {
            r: Math.random() * 255,
            g: Math.random() * 255,
            b: Math.random() * 255,
          },
          buzzer_pattern: 'none',
        },
      ],
    };

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, Buffer.from(JSON.stringify(msg)));
    console.log(" [x] Sent %s to %s on %s", JSON.stringify(msg), config.mq.queue_name, config.mq.host);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
