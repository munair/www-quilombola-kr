var express = require('express');
var fs = require('fs');
var postmark = require("postmark")("4de1b518-9aac-4e43-af9b-1915c1f984c5");


var app = express.createServer(express.logger());

app.use(express.bodyParser());

app.get('/', function(request, response) {
  var htmlBuffer = fs.readFileSync('index.html', 'utf-8');
  response.send(htmlBuffer);
});

app.post('/contact', function(request, response) {
  var name = request.body.name;
  var email = request.body.email;
  var comments = request.body.comments;
  var out = "contact name: " + name + "\tcontact email: " + email + "\tcomments: " + comments + "\n";
  postmark.send({
    "From": "zumbi@cdoseoul.com",
    "To": "zumbi@cdoseoul.com",
    "Subject": "Free Class Signup Form Submission",
    "TextBody": out,
    "Tag": "registrant"
  }, function(error, success) {
       if(error) {
          console.error("Unable to send via postmark: " + error.message);
         return;
       }
    console.info("Sent to postmark for delivery")
  });

  var htmlBuffer = fs.readFileSync('contact.html', 'utf-8');
  response.send(htmlBuffer);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
