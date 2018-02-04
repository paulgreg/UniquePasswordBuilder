# UniquePasswordBuilder

UniquePasswordBuilder is a tool to help you generate strong and different password for each site you visit.
From your master password (a strong password that you use), a password is generated using an hashing algorithm and the domain’s URL.
Scrypt or argon2 is used to hash the password.

Check [the home page for further details](http://paulgreg.me/UniquePasswordBuilder).

UniquePasswordBuilder is available via 3 tools :

  * a [web page](http://paulgreg.me/UniquePasswordBuilder),
  * a [bookmarklet](http://paulgreg.me/UniquePasswordBuilder),
  * a [Firefox](https://addons.mozilla.org/en-US/firefox/addon/uniquepasswordbuilder-addon) and [Chrome](https://chrome.google.com/webstore/detail/uniquepasswordbuider/egilgkfibealmbllcigihfhglhipnmie) Add-on.

## Build the webpage and the bookmarklet

`npm install && gulp` to build output files in `dist` directory.

## Build the Addon

Gulp generates some files into the addon directory.
So be sure to launch `gulp` the first time and each time you change JS source files.

## Publish the web page

Use `to_ghpages.sh` script to publish output files into a `gh_pages` branch, ready to publish on like github.

Attribution
--------------

The code includes [scrypt-async-js](https://github.com/dchest/scrypt-async-js), a library from Dmitry Chestnykh and icons are from [Piotr Adam Kwiatkowski](http://ikons.piotrkwiatkowski.co.uk/). Many thanks !
