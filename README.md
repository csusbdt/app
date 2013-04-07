Approach
========

## Memory strategy

All static content is read into memory at startup.  Character data is compressed using
gzip and kept in memory.  

There are no accesses to the hard disk after initialization; all requests are handled 
by returning objects stored in memory, data retrieved from the database, or
data retrieved from Facebook.

## Caching strategy

Browser requests for _/_ are served with a small HTML file that simply loads
the current version, such as _/123/_.
HTTP headers tell the browser not to cache _/_ but
cache _/123/_ and all resources under it for a year.  

If a request comes in for _/something/_ where something is not 123, then the server
returns 301 Moved Permanently to _/123/_.

One problem with the above mechanism is that the app has no way of telling the browser 
to remove old content from its cache. An alternative that does not have this problem is
to store content in local storage.  I MAY DO THIS.

## Intitialization

The main module controls server initialization.
It checks for environmental variables and calls init on other modules that need
to initialize.

## HTML Strategy

The application is contained in a single web page; all interaction with the server
after loading this page is done through ajax.

The _req_app_ module handles requests for _/ver/_, where _ver_ is a version string. 
At server start up, req_app contructs the application's HTML document.  It does
this by reading the contents of the folder _app_screens_ and contructing an in-memory
string of the HTML document.  In the process, it replaces strings _FB_APP_ID_ and 
_APP_VER_ with the application's Facebook app id and app version as provided through 
environmental variables.

The application HTML document functions as a screen container.  The initial screen is a 
temporary loading screen, which is replaced with a title screen or login screen,
depending on whether the user can be authenticated automatically on page load.

The application HTML loads the facebook library asynchronously, using a snippet of
code provided by Facebook.  The jQuery and Bootstrap libraries are loaded synchronously.
Javascript written for the application is embedded directly into the application's 
HTML document.  This javascript is spread out across the files in _app_screens_.

## Authentication

To use the application, the user must be authenticated with Facebook and have
authorized the app to access the user's basic information.

The Facebook library calls global function _fbAsyncInit_ after it is done loading.  
The application's script also calls _fbAsyncInit_, which it does on jQuery's ready event.
The second call to _fbAsyncInit_ results in a call to _a.init_.  (All of the
application objects are stored under globally scoped _a_.)

The function _a.init_ checks if the user is authenticated with Facebook and has
authorized the app to access basic Facebook information.  If so, then
it transtions from the loading screen to the title screen.  If not, it transitions
to the login screen.

## Application state

The server is used to store application state for the user.
The Mongo database has a document collection named _user_ that stores the
user's app state.  The Facebook user id is used for the primary key to look up
documents in this collection.

Applications built from this application will expand the app state and will
likely store additional information that connects users.

## Ajax

All communication between client and server is done through ajax.
Every ajax request includes an application version string and a 
short-term Facebook access token.  Every ajax request is also done
with HTTP POST and is formatted as JSON.  The JSON data sent will look
something like the following.

    {
        "appVer": "123",
        "accessToken": "12312412341231231jg23f1j2g3fj123f1j2f3u123",
        <possibly other fields>
    }

All incoming ajax requests pass through _req_op_, which parses the JSON
string into a Javascript object, checks the version string
and access token for validity, and if valid, forwards the request
to another module based on the url.

For example, when a screen needs to read the game number, 
it sends a request to _/op/get-num_ with the _appVer_ and _accessToken_
as shown above.  The data in the message is parsed by _req_app_.
Then, _req_app_ checks that _appVer_ is current.  If not, then the server
returns the following.

    { "badVersion": true }

If the version is OK, then _req_app_ sends the access token to Facebook
using the _debug_token_ function of the Facebook open graph interface.
If the access token is not valid, or if the application is not authorized
by the user, then no user id can be determined and the
server returns the following response to indicate that login (and/or app
authorization) is needed.

    { "login": true }

If the access token is valid and the user has authorized the app, then
the server gets the facebook user id from _debug_token_.

The user id is passed to the _op_get_num_ request handler, which uses the
user id to get the number from the database.

## Security

Communication between the following systems is done using HTTPS: browser and app server,
browser and Facebook, app server and Facebook.

I don't believe communciation between app server on Heroku and database 
on MongoLab is encrypted.  They are both running in Amazon's East Coast data center,
so maybe it's not too much of a weakness.

Data from the outside enters the app in the following places.

- _router.handle_ The HTTP header _x-forwarded-proto_ is used in string comparison.
- _router.route_ The request URL is parsed using Node's _url.parse_ function and
  then used in string comparison.
- _req_app.handle_ HTTP headers are used in string comparison.
- _req_file.handle_ HTTP headers are used in string comparisons.
  The request URL is parsed using Node's _url.parse_ function and a filename is
  extracted from it.  This filename string is used only in string comparisons 
  (to perform a binary search through an array of objects comprising the
  static content of the app.)
  A file extension is extracted from the filename as a substring and used as
  a property of an object that contains information about handling the content
  type represented by the extension.
- _req_op.handle_ A Javascript object is extracted from the body of an HTTP request
  using Node's JSON.parse fucntion. Properties of this object are used in
  string comprisons.  The request URL is parsed using Node's _url.parse_ function and
  then used in string comparisons.
- _fb_ A string from the outside assumed to be the user's Facebook access token is passed
  into Facebook open graph service through its _debug_token_ operation along
  with the secret app token.
  I think this is safe, but I should think about what harm could be done as an app
  authenticated through the app token.

TODO: check for injection attacks at each place where data comes into 
the server.

TODO: create /admin/ path and require admin login.


Developer Setup
===============

## Development environment

- Install git.
- Install Node.js.
- Install MongoDB.
- Have a Facebook account.
- Have a Heroku account and install the Heroku toolbelt.
- Have a MongoLab account.

## Fork the repo

Maybe the easiest way to work is for each developer to fork the app project
and then clone the forked repository into their local system.
Then the release manager can merge from the forked repositories.  
I have not tested this approach.

## Local setup

Run the following to clone the remote repository.

    git clone https://github.com/csusbdt/app.git (or do this for your forked repo)

Install dependencies.

    cd app
    npm install

Create file __.env__ with the following contents.

FB_APP_ID=<your facebook app id>
FB_SECRET=<your facebook app id>
MONGO_URI=<mongo uri string>
APP_VER=1

Start a local instance of MongoDB server.

    mongod

Start local instance of the app.

    foreman start

Check that the app is running by going to the following URL in a browser.

    http://localhost:5000/

## Staging Deployment

The above environmental variables need to be appropriately set
in the Heroku environment you deploy into.  Use the following commands.

    heroku apps                       // lists all heroku apps
    heroku config --app <app-name>    // lists the current environmental variables
    heroku config:set FB_APP_ID=12341234 -- app <app-name> 
    heroku config:set MONGO_URI=thisisauri -- app <app-name>   


