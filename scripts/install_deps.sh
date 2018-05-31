#!/bin/bash

set -eu
set -o pipefail

function install() {
  mason install $1 $2
  mason link $1 $2
}

# setup mason
./scripts/setup.sh --config local.env
source local.env

install protozero 1.6.1
install vtzero f6efb8e
install gzip-hpp 0.1.0