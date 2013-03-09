Approach
========

When the server starts, main checks for enviroinmental variables and starts initialization process.

The first request from browser should be for root.  The req_root module handles this;
it returns a tiny web page that reloads the browser window with __/ver/__, where __ver__ refers 
to a version string.

This tiny root web page is not cached; the response to __/ver/__ is cached.
When new versions of the app are released, __ver__ is changed to avoid stale content.

The req_app module handles requests for __/ver/__. At server start up, req_app reads
__app.html__ and replace __FB_APP_ID__ with the application's Facebook app id as
provided through an environmental variable.

One problem with the above mechanism is that the app has no way of telling the browser 
to remove old content from its cache.

app.html is the screen container.  The initial screen is a temporary loading screen,
which is replaced with a login screen or a title screen.

app.html loads the facebook library and app.js.  After both of these libraries are
loaded, app.init checks for login status.  If the user is logged into facebook and
has authorized the app, then app.init transitions to the title screen.  On the other
hand, if the user is not logged into facebook or is logged in but has not authorized
the app, then app.init transitions to the login screen.

The server is used to store application state for the user.
This application state includes the following information.
- the facebook user id
- the user's game state (simply a number)

When a screen needs to read the game number, it sends a facebook access token to 
__/op/get-num__.  The handler for get-num comes from the req_op module.
The get-num handler uses the accessToken to get the uid from facebook.
It then reads the number associated with that uid from the database.
If a document for the user doesn't exist, then one is created.

Developer Setup
===============

## Development environment

- Install git.
- Install Node.js.
- Install MongoDB.
- Have a Github account.
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

FACEBOOK_APP_ID=<your facebook app id>
FACEBOOK_SECRET=<your facebook app id>
MONGO_HOST=localhost
MONGO_PORT=27017
APP_VER=1

Start a local instance of MongoDB server.

    mongod

Start local instance of the app.

    foreman start

Check that the app is running by going to the following URL in a browser.

    http://localhost:5000/


