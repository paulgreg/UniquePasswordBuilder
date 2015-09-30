# UniquePasswordBuilder

UniquePasswordBuilder is a tool to help you generate strong and different password for each site you visit.
From your master password (a strong password that you use), a password is generated using an hashing algorithm and the domain’s URL.
Scrypt is used to hash the password.

Check [the home page for further details](http://paulgreg.me/UniquePasswordBuilder).

UniquePasswordBuilder is available via 3 tools :

  * a [web page](http://paulgreg.me/UniquePasswordBuilder),
  * a [bookmarklet](http://paulgreg.me/UniquePasswordBuilder),
  * a [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/uniquepasswordbuilder-addon).


## Build the webpage and the bookmarklet

Launch `npm install` and `bower install`, then launch `gulp` which will concatenete and uglify JS files.

## Build the Addon

Gulp generates files (data/upb-main.min.js and data/icon.png) which are copied into the data directory. So be sure to launch `gulp` the first time and each time you change JS source files.
Then, you need to install the [Firefox SDK Add-on](https://addons.mozilla.org/en-US/developers/docs/sdk/latest/) via a `npm install jpm`.
To run the addon, type `./node_modules/.bin/jpm run` and `./node_modules/.bin/jpm xpi` to build the package.

Attribution
--------------

The code includes [scrypt-async-js](https://github.com/dchest/scrypt-async-js), a library from Dmitry Chestnykh and icons are from [Piotr Adam Kwiatkowski](http://ikons.piotrkwiatkowski.co.uk/). Many thanks !
