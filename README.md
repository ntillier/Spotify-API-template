# Spotify's API

> **You will discover how Spotify's API works thanks to this template, and be able to use it from the code I already wrote.**

**Summary:**
* Create an app with Spotify
* How the API works
* How the project works
* Next steps


## Create an app with Spotify 
_You can create app using your spotify account._

Follow the following steps:
* Go to [The developers' dashboard](https://developer.spotify.com/dashboard/)
* Sign into Spotify or create a new account.
* Go to your [dashboard](https://developer.spotify.com/dashboard/applications) to create an new app.
* Create an app
* Copy its id and its secret
* Fork this repl if you haven't already, and, in the environment variables, add two secrets:
  * Add a new secret, with `SPOTIFY_ID` as key, and your app's id as value.
  * Add a new secret, with `SPOTIFY_SECRET` as key, a your app's secret as value
* Run the app, and go to https://localhost/! You can normally search for artists, albums...

## How the API works
The authentication part of Spotify's API isn't that simple. This repl will help you to cover this part (mainly).

Each app using Spotify has an id, and a secret. These informations are used to check who is using the API.
But you can't use them to access to the API. They will give you access to a temporary token (which has a duration of one hour)

**In fact, you must follow [these steps](https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/) to access the API:**
* Do a request to [an API endpoint](https://accounts.spotify.com/api/token) in order to access to the token
  * With the `POST` method
  * Adding two parameters in the header of the request
    * `Content-Type`: `application/x-www-form-urlencoded`
    * Authorization: A prefix, `Basic `, plus the id and the secret separated by `:` encoded to a base64 String.
  * With in the body the `grant_type` parameter set to 
 `client_credentials`

Then, with the token you've fetched, you can send a request to Spotify's API. You need to do a `GET` request, with, in the header, the `Authorization` parameter. Its value must be the `Bearer` prefix with the token after.

> **Note:** In this project, all the requests to Spotify's API are done from the backend. You can do it from the frontend part, by providing only the token to the user.

## How the project works
In the `index.js` file, I use Express to manage the routes. In these routes, there is a route called `/api/search`. When a request is processed, the program does a request to Spotify's API, and then send the datas fetched.

But let's look at the modules in the folder called `spotify`.

There are three files in this folder, called `request.js`, `spotify.js` and `token.js`.

The first, `request.js`, is a simple module to do requests using the built-in module `https`. It exports a single function, which accepts some options for the request, and a string for the body.

The second is the module that will manage our project's API. It exports some function such as `search()`, `getUser()` to do request to one of Spotify's API.

The third module is the main part of this template, so I will better describe what he does.
First of all, we create an object, called `obj`. This object has two keys, `token` and `last`. The `token` key will store the current token, and the `last` key will have as value the date of the last update of the token.
Then, the program exports a function, which needs and id and a secret as parameters, and returns a `Promise`. 

**This function does that:**
* If the id or the secret aren't specified, it throws an error.
* If the last token was retrieved less than one hour before, it resolves the previous token.
* Otherwise:
  *  It sends a request to Spotify's API, with the good headers to access to the token.
  *  If there is an error, it rejects the error.
  *  If there isn't any error, change the variable `obj`, set in the Database the new value of `obj`, and resolves the new token. 

The reason why it stores the variable `obj` in the database is that when you code and develop your project, you can have to run it to see the new modifications. However, it is useles to look for a new token. So, when you run the project, it search if a token was already in the database, in order to recover the previous token.

## Next steps
From this template, you can do many things!
You can extand its features by using [Deezer's API](https://developers.deezer.com/), or by looking for [all the endpoints of Spotify's API](https://developer.spotify.com/documentation/web-api/reference/#/)
