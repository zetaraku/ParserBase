ParserBase
===========
[![Build Status](https://travis-ci.org/zetaraku/ParserBase.svg?branch=master)](https://travis-ci.org/zetaraku/ParserBase)
[![Coverage Status](https://coveralls.io/repos/github/zetaraku/ParserBase/badge.svg?branch=master)](https://coveralls.io/github/zetaraku/ParserBase?branch=master)
[![codecov](https://codecov.io/gh/zetaraku/ParserBase/branch/master/graph/badge.svg)](https://codecov.io/gh/zetaraku/ParserBase)
[![Maintainability](https://api.codeclimate.com/v1/badges/2af5d485d54b7bbb3f76/maintainability)](https://codeclimate.com/github/zetaraku/ParserBase/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2af5d485d54b7bbb3f76/test_coverage)](https://codeclimate.com/github/zetaraku/ParserBase/test_coverage)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fzetaraku%2FParserBase.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fzetaraku%2FParserBase?ref=badge_shield)
[![Greenkeeper badge](https://badges.greenkeeper.io/zetaraku/ParserBase.svg)](https://greenkeeper.io/)

This is a **demonstrative parser** with a **webpage user interface**.

It can build and display:

* First Set (1) Table
* Follow Set (1) Table
* Predict Set (1) Table
* LL(1) Predict Table
* LR(0) FSM
* LR(1) FSM
* LR(1) Goto/Action Table

and do demonstration of:

* LL(1) parse
* LR(1) parse

and display their parse trees.

Before you start
----------------

This project is *ready to use* as a web application.

You can *try it now* [**HERE**](https://zetaraku.github.io/ParserBase/) !

If you want to modify it, you must have installed [Node.js](https://nodejs.org/).

Then in the project directory,

use `npm install` *once* to install all dependencies.

Developing
----------------

1. Use `npm run wp-devs` to start the webpack-dev-server for development.

webpack-dev-server will watch your files and reload the page automatically.

2. Before you deploy, use `npx run wp` to generate the target files (into `./dist/`).

License
-------

Copyright © 2017, Raku Zeta. Licensed under the MIT license.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fzetaraku%2FParserBase.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fzetaraku%2FParserBase?ref=badge_large)
