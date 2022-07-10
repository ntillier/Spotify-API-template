'use strict';

/*==========
This is a module to access to a secret token, with an id and a secret, given by Spotify.

More infos here:
https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/
==========*/

/*==========
We import a module to do the requests, and the module to manage the replit's database;
==========*/
const request = require('./request');
const Database = require('@replit/database');

/*==========
We access to the database.
==========*/
const db = new Database();

/*==========
A Spotify access token expires after one hour. We will store the token and the last update in this object.

The token key is for the token, and the last key is for the last update (number of milliseconds ellapsed since January 1, 1970 00:00:00)
==========*/
let obj = {
  token: null,
  last: 0
};

/*==========
We access to the database. If the key exists, we set its value to the variable called obj.
==========*/
db.get('SPOTIFY_TOKEN')
.then(dts => {
  if (dts) {
    obj = dts;
  }
});

/*==========
We export a post function, that will return a token.
==========*/
module.exports = function (id, secret) {
  
  /*==========
  The function return a Promise
  ==========*/
  return new Promise((resolve, reject) => {

    /*==========
    If the id or the secret are not specified, we throw an error
    ==========*/
    if (!id || !secret) {
      throw new Error('You need to specify an id and a secret, in order to access to a secret token.')
    }

    /*==========
    If an hour is not passed between the date of recovery of the last token and the current time, we return the previous token. 
    The time is in milliseconds, and there are 3,600,000 milliseconds in an hour ( 1000 * 60 * 60 ).

    Otherwise we retrieve a new token.
    ==========*/
    if (new Date().getTime() - obj.last <= 3600000) {

      /*==========
      We resolve the previous token.
      ==========*/
      resolve(obj.token);
    } else {

      /*==========
      There are the required infos in order to have the token.
      We send a 'Authorization' header with the id and the secret encoded to base64.
      ==========*/
      const infos = {
        host: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64')
        }
      };

      /*==========
      We do a request to have a new token. We have to encode to a base64 string the informations.
      ==========*/
      request(infos, 'grant_type=client_credentials')
        .then(dts => {
          
          /*==========
          If there isn't any error, we have the token, so we resolve it and store it in the database.
          Otherwise we reject the error.
          ==========*/
          if (!dts.err) {
            obj = {
              token: dts.body.access_token,
              last: new Date().getTime()
            }
            db.set('SPOTIFY_TOKEN', obj)
              .then(() => {
                console.log('You have a new token!');
              });
            resolve(dts.body.access_token);
          } else {
            reject(dts.err);
          }
        });
    }
  });
}