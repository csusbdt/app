app
===

This is another attempt to come up with an example of a simple and low-cost foundation to build scalable web applications.

The basic idea in this example is to have a single html document that acts as a screen container.
Screens come in 2 parts: script that provides the functionality for the screen and that loads the html screen fragement into the screen container.

Screen fragments are manually cached in local storage.

Screen scripts are encouraged to be cached by browsers for as long as possible.

Screen script file names include version information. 

Stale screen fragments are identified by md5 hashes.

Screen scripts are generated from templates contained in the screens folder.

