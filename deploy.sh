#!/bin/bash

if [[ $TRAVIS_BRANCH == 'master' ]]; then
  yarn deploy
fi