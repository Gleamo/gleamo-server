var amqp = require('amqplib/callback_api');
var config = require('../config.json');

amqp.connect(config.mq.url, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = config.mq.queue_name;
    var msg = {
      commands: [
        {
          duration: 5000,
          start_offset: 0,
          end_offset: 0,
          color: {
            r: 100,
            g: 120,
            b: 250,
          },
          buzzer_pattern: 'none',
        },
      ],
    };

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, Buffer.from(JSON.stringify(msg)));
    console.log(" [x] Sent %s to %s on %s", JSON.stringify(msg), config.mq.queue_name, config.mq.url);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
