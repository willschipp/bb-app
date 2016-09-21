var express = require('express');
var elasticsearch = require('bunyan-elasticsearch');


var app = express();

var esStream = new elasticsearch({
  indexPattern: '[logstash-]YYYY.MM.DD',
  type:'logs',
  host:'elasticsearch:9200'
});

esStream.on('error',function(err) {
  console.log(err);
});

app.use(require('express-bunyan-logger')({
  name:'log',
  streams: [
    { stream: esStream }
    // { stream: process.stdout }
  ],
  includeFn:function userCapture(req,res) {
    if (req.user) {
      return {
        username: req.user.attributes.username
      };
    }
  }
}));


app.get('/',function(req,res) {
  res.send('Hello from the app');
});

app.listen(3000,function() { });
