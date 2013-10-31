var express = require('express');
var fs = require('fs');
var postmark = require("postmark")(process.env.POSTMARK_API_KEY);
var swig = require('swig');


var app = express(express.logger());

app.use(express.bodyParser());
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/');

app.get('/', function(request, response) {
  _metatags = swig.compileFile('_metatags.html');
  _stylesheets = swig.compileFile('_stylesheets.html');
  _javascript = swig.compileFile('_javascript.html');
  _tabHome = swig.compileFile('_tabHome.html');
  _tabAbout = swig.compileFile('_tabAbout.html');
  _tabContact = swig.compileFile('_tabContact.html');
  _tabProjects = swig.compileFile('_tabProjects.html');
  _analytics = swig.compileFile('_analytics.html');
  meta = _metatags();
  css = _stylesheets();
  js = _javascript();
  home = _tabHome();
  about = _tabAbout();
  contact = _tabContact();
  projects = _tabProjects();
  ga = _analytics();
  response.render('index', { 
	pagename: 	'quilombola',
	metatags: 	meta,
	stylesheets: 	css,
	javascript: 	js,
	tabHome:	home,
	tabAbout:	about,
	tabContact:	contact,
	tabProjects:	projects,
	analytics: 	ga });
});

app.post('/contact', function(request, response) {
  var name = request.body.name;
  var email = request.body.email;
  var comments = request.body.comments;
  var out = "contact name: " + name + "\tcontact email: " + email + "\tcomments: " + comments + "\n";
  postmark.send({
    "From": "munair@quilombola.com",
    "To": "info@quilombola.com",
    "Subject": "Quilombola Information Request",
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
