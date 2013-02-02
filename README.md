app
===

This is another attempt to come up with an example of a simple and low-cost foundation to build scalable web applications.

The basic idea in this example is to have a single html document that acts as a screen container.
Screens come in 2 parts: script that provides the functionality for the screen and that loads the html screen fragement into the screen container.

Screen scripts are encouraged to be cached by browsers for as long as possible.

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


