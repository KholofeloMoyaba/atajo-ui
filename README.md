# Atajo-UI

This is a ui complement of Atajo based on ionic.

Use ionic for [documentation](http://ionicframework.com/docs/).

However, note that tags prefixed `ion-` should be renamed to `aui-`, and services named `$ionic..` should be renamed `$atajoUi...`

## Building Package for Atajo-Client
To build a ready to build package for Atajo-Client do the following

- Change sass variables if needed. Normally (also recommended) only change the colour values as defined in `scss/_colours-override.scss`.
- run `gulp clientPackage`, this will build `ATAJO_UI.json` and a `ATAJO_UI` folder that can be used as a package in Atajo-Client.
