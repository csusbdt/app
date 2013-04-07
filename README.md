Approach
========

## Memory strategy

All static content is read into memory at startup.  Character data is compressed using
gzip and kept in memory.  

There are no accesses to the hard disk after initialization; all requests are handled 
by returning objects stored in memory or data retrieved from the database.

## Caching strategy

Browser requests for '/' are served with a small HTML file that simply loads
the current version, such as '/123/', assuming for the sake of explanation
that the current version is 123.  HTTP headers tell the browser not to cache '/' but
cache '/123/' and all resources under it for a year.  

If a request comes in for '/something/' where something is not 123, then the server
returns an HTTP permanently moved message to the browser, pointing to '/123/'.

One problem with the above mechanism is that the app has no way of telling the browser 
to remove old content from its cache. An alternative that does not have this problem is
to store content in local storage.

## Intitialization

Execution starts in main.js.  The main module controls server initialization.
It checks for environmental variables and calls init on modules that need
initialization.

## HTML Strategy

THe application is contained in a single web page; all interaction with the server
after loading this page is done through ajax.

The req_app module handles requests for __/ver/__, where __ver__ is a version string. 
At server start up, req_app contructs the application's HTML document.  It does
this by reading the contents of the folder __app_screens__ and contructing an in-memory
string of the HTML document.  In the process, it replaces strings __FB_APP_ID__ and 
__APP_VER__ with the application's Facebook app id and app version as provided through 
environmental variables by the same names.

The application HTML document functions as a screen container.  The initial screen is a 
temporary loading screen, which is replaced with a title screen or login screen,
depending on whether the user can be authenticated automatically on page load.

The application HTML loads the facebook library asynchronously, using a snippet of
code provided by Facebook.  The jQuery and Bootstrap libraries are loaded synchronously.
Javascript written for the application is embedded directly into the application's 
HTML document.  This javascript is spread out across the files in app_screens.

## Authentication

To use the application, the user must be authenticated with Facebook and have
authorizaed the app to access the user's basic information (the lowest level of
Facebook privileges).

Facebook library calls window.fbAsyncInit after it is done loading.  The application's
script also calls fbAsyncInit, which it does on jQuery's ready event.
On the second call to fbAsyncInit, it will call window.a.init.

The function a.init checks if the user is authenticated with Facebook and has
authorized the app to access basic Facebook information.  If so, then
it transtions from the loading screen to the title screen.  If not, it transitions
to the login screen.

## Application state

Currently, the server is used to store application state for the user.
This application state includes the following information.
- the facebook user id
- the user's app state (simply a number)

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

All incoming ajax requests pass through req_op, which parses the JSON
string into a Javascript object, checks the version string
and access token for validity, and if valid, forwards the request
to another module based on the url.

For example, when a screen needs to read the game number, 
it sends a request to __/op/get-num__ with the appVer and accessToken
as shown above.  The data in the message is parsed by req_app.
Then, req_app checks that appVer is current.  If not, then the server
returns the following.

    { "badVersion": true }

If the version is OK, then req_app sends the accessToken to Facebook
using the __debug_token__ function of the Facebook open graph interface.
If the access token is not valid, or if the application is not authorized
by the user, then no user id can be determined and the
server returns the following response to indicate that login (and/or app
authorization) is needed.

    { "login": true }

If the access token is valid and the user has authorized the app, then
the server gets the facebook user id from __debug_token__.

The user id is passed to the op_get_num request handler, which uses the
user id to get the number from the database.

## Security

Communication between all systems is done using HTTPS: browser and app server,
browser and Facebook, app server and Facebook.

I don't know if communciation between app server on Heroku and database 
on MongoLab is secure.  They are both running in Amazon's East Coast data center,
so maybe it's too much of a weakness.

TODO: need to do check for injection attacks at each place where data comes into 
the server.


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


