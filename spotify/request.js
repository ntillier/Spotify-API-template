'use strict';

/*==========
This is the module to do https requests.

We first require the https built-in module.
==========*/
const https = require('https');

/*==========
We export a function to do requests.
==========*/
module.exports = function (options, body = '') {

  /*==========
  We return a Promise.
  ==========*/
  return new Promise((resolve, reject) => {

    /*==========
    This is the request object. We call it req.
    ==========*/
    const req = https.request(options, res => {

      /*==========
      We set the encoding to utf-8
      ==========*/
      res.setEncoding('utf8');

      /*==========
      The datas' string will store the body of the request
      ==========*/
      let datas = '';

      /*==========
      When we receive a part of the body, we add it to he datas' variable.
      ==========*/
      res.on('data', chunk => {
        datas += chunk;
      });

      /*==========
      When this is the end of the request, we try to resolve the datas as an object, with JSON.parse().

      If we can do it, we return the error, and the datas. 
      Warning: If there is an error, it only means that the Promise resolve the body as a String.
      ==========*/
      res.on('end', () => {
        try {
          resolve({
            error: null, 
            body: JSON.parse(datas)
          });
        } catch (err) {
          reject({
            error: err, 
            body: datas
          });
        }
      })
    });

    /*==========
    We write some datas in the body (it will no works if it's a GET request)
    Then we send the request.
    ==========*/
    req.write(body);
    req.end();
  });
}