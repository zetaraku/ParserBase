Parser Base
===========
[![Build Status](https://travis-ci.org/zetaraku/ParserBase.svg?branch=master)](https://travis-ci.org/zetaraku/ParserBase)
[![Coverage Status](https://coveralls.io/repos/github/zetaraku/ParserBase/badge.svg?branch=master)](https://coveralls.io/github/zetaraku/ParserBase?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/2af5d485d54b7bbb3f76/maintainability)](https://codeclimate.com/github/zetaraku/ParserBase/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2af5d485d54b7bbb3f76/test_coverage)](https://codeclimate.com/github/zetaraku/ParserBase/test_coverage)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fzetaraku%2FParserBase.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fzetaraku%2FParserBase?ref=badge_shield)

This is a **demonstrative parser** with a **webpage user interface**.

It can:

* build First Set (1) Table
* build Follow Set (1) Table
* build Predict Set (1) Table
* build LL(1) Predict Table
* build LR(0) FSM
* build LR(1) FSM
* build LR(1) Goto/Action Table

and do demonstration of:

* LL(1) parse
* LR(1) parse

and generate visualization of:

* LR(0) FSM
* LR(1) FSM
* LL(1) Parse Tree
* LR(1) Parse Tree

Before you start
----------------

This project is *ready to use* as a web application.

You can *try it now* [**HERE**](https://zetaraku.github.io/ParserBase/) !

If you want to modify it, you must have installed [Node.js](https://nodejs.org/).

Then in the project directory,

1. use `npm install` *once* to install all dependencies.

2. use `npx webpack` to generate the target files (into `./dist/`).

	* You can use the option `--watch` to watch for changes in files.

License
-------

Copyright © 2017, Raku Zeta. Licensed under the MIT license.

Other used libraries and license infomation are located in `./js/lib/`.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fzetaraku%2FParserBase.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fzetaraku%2FParserBase?ref=badge_large)