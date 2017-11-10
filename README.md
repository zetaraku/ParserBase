Parser Base
===========
[![Build Status](https://travis-ci.org/ztrk1600/ParserBase.svg?branch=master)](https://travis-ci.org/ztrk1600/ParserBase)
[![Coverage Status](https://coveralls.io/repos/github/ztrk1600/ParserBase/badge.svg?branch=master)](https://coveralls.io/github/ztrk1600/ParserBase?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/23b0788de5fdb4364057/maintainability)](https://codeclimate.com/github/ztrk1600/ParserBase/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/23b0788de5fdb4364057/test_coverage)](https://codeclimate.com/github/ztrk1600/ParserBase/test_coverage)

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

You can *try it now* [**HERE**](https://ztrk1600.github.io/ParserBase/dist) !

If you want to modify it, you must have installed [Node.js](https://nodejs.org/).

Then in the project directory,

1. use ` npm install ` *once* to install all devDependencies.

2. use ` gulp ` to rebuild all files *after you edit the source*.

License
-------

Copyright © 2017, Raku Zeta. Licensed under the MIT license.

Other used libraries and license infomation are located in `ParserBase/js/lib/`.
