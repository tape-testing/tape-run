#!/usr/bin/env bash
BIN="../node_modules/.bin"

$BIN/browserify -t coverify ../test/fixtures/one.js | ../bin/run.js | $BIN/coverify

