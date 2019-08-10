# UniquePasswordBuilder

UniquePasswordBuilder is a tool to help you generate strong and different password for each site you visit.
From your master password (a strong password that you use), a password is generated using an hashing algorithm and the domain’s URL.
Scrypt or argon2 is used to hash the password.

Check [the home page for further details](http://paulgreg.me/UniquePasswordBuilder).

UniquePasswordBuilder is available via 3 tools :

  * a [web page](http://paulgreg.me/UniquePasswordBuilder),
  * a [bookmarklet](http://paulgreg.me/UniquePasswordBuilder),
  * a [Firefox](https://addons.mozilla.org/en-US/firefox/addon/uniquepasswordbuilder-addon) and [Chrome](https://chrome.google.com/webstore/detail/uniquepasswordbuider/egilgkfibealmbllcigihfhglhipnmie) Add-on.

## Dependencies

UniquePasswordBuilder is depending on some dependencies in order to be build (gulp) and needs 3 libraries for runtime :

- argon2-browser 1.5.3
- scrypt-async 2.0.1
- font-awesome 4.7.0

Dependencies are installed via npm.

The `package-lock.json` file contains the URL from where dependencies are downloaded.

## Build the webpage and the bookmarklet

`npm install && gulp` to build output files in `dist` directory.

You can run `gulp clean` to remove the `dist` folder.

## Build the Addon

Gulp generates some files into the addon directory.

So be sure to launch `npm install && gulp` the first time and each time you change JS source files.

Then, use `addon/build.sh` to generate the zip.

## Self-hosting the PWA

You can simply checkout the branch `gh-pages` (already built) or build the application (see above) then copy the `dist` folder on your server.

## Publish the web page

Use `to_ghpages.sh` script to publish output files into a `gh_pages` branch, ready to publish on like github.

Attribution
--------------

The code includes [scrypt-async-js](https://github.com/dchest/scrypt-async-js), a library from Dmitry Chestnykh and icons are from [Piotr Adam Kwiatkowski](http://ikons.piotrkwiatkowski.co.uk/). Many thanks !
