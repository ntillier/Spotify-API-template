'use strict';

/*==========
This is the main module of the template. It will do the requests to Spotify's API, and retrieve the datas. 

This is a template, so there are only the main features.

The main part of the module is the access function. It get the token, do a request with a pathname, and return a Promise.

The documentation of the API:
https://developer.spotify.com/console/

==========*/

/*==========
We require some local modules.
============*/
const request = require('./request');
const Token = require('./token');

/*==========
The dotenv is needed to access to environment variables
==========*/
require('dotenv').config();


/*==========
The main function, to access to the API
==========*/
function access(path) {

  /*==========
  Id the path isn't specified, we throw an error.
  ==========*/
  if (!path) {
    throw new Error('We need a path to access to the API.')
  }

  /*==========
  We return a Promise
  ==========*/
  return new Promise((resolve, reject) => {
    Token(
      process.env.SPOTIFY_ID, 
      process.env.SPOTIFY_SECRET
    ).then(token => {

      /*==========
      Once we have the token, we do a request to have the results.
      ==========*/
      request({
        host: 'api.spotify.com',
        path: path,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(dts => {

          /*==========
          If there is an error, we reject the error, otherwise we resolve the body.
          ==========*/
          if (dts.err) {
            reject(err);
          } else {
            resolve(dts.body);
          }
        });
    });
  });
}

/*==========
The function to search for result.

https://developer.spotify.com/console/get-search-item/
==========*/
function search (infos) {

  /*==========
  We have a default object, with four parameters: the query, the limit, the offset, and the type.
  ==========*/
  const send = Object.assign({
    query: 'Hello world!',
    limit: 20,
    offset: 0,
    types: 'track'
  }, infos);

  /*==========
  We return the access Object
  ==========*/
  return access(
      `/v1/search?q=${encodeURI(send.query)}&type=${send.types}&limit=${send.limit}&offset=${send.offset}`
  );
}

/*==========
This is an example. It works for playlists, albums, episodes...

https://developer.spotify.com/console/get-artist/
==========*/
function getItem(type, id) {
  
  /*==========
  If the type or the id are not specified, we throw an error, otherwise we return the access object;
  ==========*/
  if (!type || !id) {
    throw new Error('We need a type and an id.')
  }
  
  return access(`/v1/${type}/${id}`);
} 

/*==========
Get a user.

https://developer.spotify.com/console/get-users-profile/
==========*/
function getUser(id) {

  /*==========
  If the id isn't specified, we throw an error, otherwise we return the access object;
  ==========*/
  if (!id) {
    throw new Error('We need an id to find the user');
  }
  return access(`/v1/users/${id}`)
}

/*==========
We export all these modules :)
==========*/
exports.search = search;
exports.access = access;
exports.getItem = getItem;
exports.getUser = getUser;