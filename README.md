Approach
========

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

When the server starts, main checks for enviroinmental variables and starts initialization process.

All static content is read into memory at startup.  Character data is compressed using
gzip and kept in memory.  

There are no accesses to the hard disk after initialization;
all requests are handled by returning objects stored in memory or data retrieved from
the database.

The req_app module handles requests for __/ver/__. At server start up, req_app reads
__app.html__ and replaces __FB_APP_ID__ with the application's Facebook app id as
provided through an environmental variable by the same name.

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


