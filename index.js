/*==========
We require some modules:
 * express to handle the requests
 * fs to send the files
 * spotify, I think you know why
==========*/
const express = require('express');
const fs = require('fs');
const spotify = require('./spotify/spotify');

/*==========
We create an app.
==========*/
const app = express();

/*==========
The function that will send the pages (index.html, script.js, style.css)
==========*/
function send(path, type, res) {
  const stream = fs.createReadStream(path);
  stream.on('error', function() {
    res.writeHead(200);
    res.end();
  });
  res.setHeader('Content-type', type);
  res.writeHead(200);
  stream.pipe(res);
}

/*==========
We send the (good) file, depending on the incoming request.
==========*/
app.get('/script.js', (req, res) => {
  send('./script.js', 'application/javascript', res);
});

app.get('/style.css', (req, res) => {
  send('./style.css', 'text/css', res);
});

/*==========
This is the api endpoint, that will send the results we will have with our spotify module!

Example request:
/api/search?types=track,artist&query=hello
==========*/
app.get('/api/search', (req, res) => {
  const types = req.query.types;

  /*==========
  We send the request, and we then the result if there isn't any error, otherwise we send the error.
  ==========*/
  spotify.search({
    types: (types || '').length > 0 ? types : 'track',
    query: req.query.query || ''
  })
    .then(dts => {
      res.status(200);
      res.json({
        results: dts
      })
    })
    .catch(err => {
      res.status(200);
      res.json({
        error: `An error occured: ${err}`
      })
    })
});

/*==========
We send the html file.
==========*/
app.get('/', (req, res) => {
  send('./index.html', 'text/html', res);
});

/*==========
We start listening for requests.
==========*/
app.listen(process.env.PORT || 3000);
