#!/bin/sh
doctl sls deploy . --verbose-build --env ./.env
