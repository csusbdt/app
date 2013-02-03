# Setup of the app594 project

## Overview

The project is setup to resemble a professional development environment,
with deploys for development, staging and production.
This document explains the steps
a release manager would follow to setup a project;
other project developers would not do this.

In the instructions given below, the string _you_ refers to a string 
that you would use to make the the names unique.

## Create a git repository for the project

Create a repository at Github; select to include a README file,
which will contain links to readings and instructions on how to
set up a local development environment.

Clone the repository with the following.

    git clone https://github.com/csusbdt/you-app.git

At this point, there is 1 remote repository location called `origin`.
To see this, run the following.

    git remote

To see the location of this remote repository, run the following.

    git remote -v

## Create Heroku apps for staging and production

The heroku command relies on an ssh key stored in your system;
if you don't have an ssh key setup yet, then you need to generate
one. If the following file exists, then you have an ssh key that
heroku can find.  (Could be in a different location in Windows.)

    ~/.ssh/id_rsa.pub

If the above file doesn't exist, then do the following to generate
a key and register with heroku.

    ssh-keygen -t rsa

Log into heroku.

    heroku login

Inside the app folder, run the following 2 commands to create remote
Heroku apps for staging and release deployments of the project.

    heroku apps:create you-apps --remote staging
    heroku apps:create you-app  --remote production
 
As a result, the staging and production urls are the following.

    http://apps.heroku.com
    http://app.heroku.com

To see these Heroku apps, run the following.

    heroku apps

Also, the _heroku apps:create_ command given above configures the local repository
with 2 additional remote locations named _staging_ and _production_.
To see these, run the following.

    git remote -v

Note that when other project developers clone the repository from Github,
their repositories will only contain a reference to the remote at Github called _origin_.

## Create Facebook apps for development, staging and production

### development

Go to https://developers.facebook.com/apps and create a new app named appd
with the following settings.

- For the app display name, use any string. 
- For the app namespace, use `you-appd`. 
- For the app domain, use `localhost`.
- Enable sandbox mode so that only developers will be able to use the app.
- Under the integration options, select _Website with Facebook Login_
  and for the site url use `http://localhost:5000/`.

To deploy a local development instance, the system needs access to the app's
Facebook id and secret.
We pass these to the server with the following environmental variables.

    FB_APP_ID = <development app id>
    FB_APP_SECRET = <development app secret>

Place the above 2 lines in a file named `.env`.
This file will be read by the foreman program that we will use
to launch the app locally.

Other developers will set different values for their development deployment,
so omit `.env` from the repository by adding it to `.gitignore`.


### staging

Create another Facebook app named `you-apps` with the following settings.

- For the app display name, use any string.
- For the app namespace, use `you-apps`. 
- For the app domain, use `you-apps.herokuapp.com`.
- Enable sandbox mode so that only developers will be able to use the app.
- Under the integration options, select _Website with Facebook Login_ and
for the site url use `https://you-apps.herokuapp.com/`.

In order to set variables for the Heroku runtime environment,
you need to do an initial deployment. (I need to verify this statement.)

    git push staging master

Use the `heroku config:add` command to write the app id and secret into
Heroku's execution environment for the staging app.

    heroku config:add --app you-apps FB_APP_ID=<staging id>
    heroku config:add --app you-apps FB_APP_SECRET=<staging secret>

You can check these settings by using the following command.

    heroku config --app you-apps


### production

Create another app named app with the following settings.

- For the app display name, use any string.
- For the app namespace, use `you-app`. 
- For the app domain, use `you-app.herokuapp.com`.
- Leave sandbox mode disabled.
- Under the integration options, select _Website with Facebook Login_
  and for the site url use `https://you-app.herokuapp.com/`.

Do an initial deployment before trying to set Heroku runtime environment.

    git push production master

Use the `heroku config:add` command to write the app id and secret into
Heroku's execution environment for the production app.

    heroku config:add --app you-app FB_APP_ID=<production id>
    heroku config:add --app you-app FB_APP_SECRET=<production secret>

You can check these settings by using the following command.

    heroku config --app you-app

## Create Mongo databases

Install Mongo locally for testing in the development deployment.
Use the binary distribution provided through the MongoDB website (referred to as the 10gen builds).  Note that there are easier approaches to installing mongo, but this approach will work on all possible development platforms that your developrs might use: Windows, OS X and Linux.

The following runs Mongo locally.

    mongod

Create 2 Mongo databases through the MongoLab website, a database for staging named _you-apps_
and another for production named _you-app_. 
Make a database user for each database.
Make a note of the driver-based connection strings
for these 2 databases provided through the MongoLab Web site.

Use the `heroku config:add` command to write the configuration data needed by
that app to connect to the database.

    heroku config:add --app you-apps MONGO_PORT=<staging mongodb port number>
    heroku config:add --app you-apps MONGO_HOST=<staging mongodb host name>

    heroku config:add --app you-app MONGO_PORT=<production mongodb port number>
    heroku config:add --app you-app MONGO_HOST=<production mongodb host name>

You can check the settings by using the following command.

    heroku config --app you-apps
    heroku config --app you-app

## Configure dependencies

Determine the versions of node and npm installed.  (Make sure they are current.)

    node --version
    npm --version

Determine the most recent version of mongodb.

    npm view mongodb version

Create a file named `package.json` with the following contents.  (Make sure the version numbers match with what you have installed.)

````
{
    "name": "app594",
    "version": "0.0.1",
    "description": "App illustrating integration of MongoDB, Nodejs, Heroku, and Facebook",
    "dependencies": {
        "mongodb": "1.2.11"
    },
    "engines": {
        "node": "0.8.17",
        "npm": "1.1.65"
    }
}
````

Install dependencies in local environment.  The npm command knows what to install by reading `package.json`.

    npm install

Run the following to see the installed modules.

    npm ls

The above command creates folder `node_modules` for the installed dependencies.  This folder should not be in the repository.  Each developer who clones the repository needs to run `npm install` to install the dependent modules.  Also, when the project is deployed for staging or production, the Heroku environment runs `npm intall --production` automatically. So, create file `.gitignore` with the following contents.

    node_modules


# WORK IN PROGRESS FROM HERE DOWN


Create file `Procfile` with the following contents.
This file says to run the command `node web.js` on in a web process (a _web dyno_).

    web: node web.js

The Procfile specifies the processes to start up on deployment (or re-deployment).  Heroku uses the foreman program to start the processes specified in the Procfile, both locally and on Heroku. To test the app in the local development environment, run the following.

    foreman start

Go to the following URL in a browser to test the app.

    http://localhost:5000/




## Create first app



Commit to the master branch, push to github.

    git add .
    git commit -m "first runnable version"
    git push origin master

## Deploy into the staging environment

    git push staging master

Check that a single web dyno is allocated.

    heroku ps --app app594s

If you need to, allocate a single web dyno; more than one costs money.

    heroku ps:scale web=1

Test the staged app by going to the following url in a browser.

    http://app594s.herokuapp.com/


## Deploy into the production environment

    git push production master

Check that a single web dyno is allocated.

    heroku ps --app app594

If you need to, allocate a single web dyno; more than one costs money.

    heroku ps:scale web=1

Test the staged app by going to the following url in a browser.

    http://app594.herokuapp.com/



Run server and test with a browser.

    foreman start

Go to http://localhost:5000/ in a browser.


