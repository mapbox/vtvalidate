#!/usr/bin/env bash

set -eu
set -o pipefail

toolchain_dir=$(pwd)/wasm-toolchain
mkdir -p ${toolchain_dir}

function download_and_extract {
    if [ -f "$2" ] ; then
        return
    fi
    curl -sSfL "$1" -o "$2"
    HASH=`git hash-object $2`
    if [ "$3" != "${HASH}" ] ; then
        echo "Hash ${HASH} of $2 doesn't match $3"
        exit 1
    fi
    (cd ${toolchain_dir} && tar xzf $2)
}

function setup_emsdk {
    download_and_extract \
        https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz \
        ${toolchain_dir}/emsdk-portable.tgz \
        90c9b5c2ac03f4ac5295fa0f7e5caaf343169b3f

    ${toolchain_dir}/emsdk-portable/emsdk update
    ${toolchain_dir}/emsdk-portable/emsdk install latest
    ${toolchain_dir}/emsdk-portable/emsdk activate latest
}


if [[ ! -f ${toolchain_dir}/emsdk-portable/emsdk_env.sh ]]; then
    setup_emsdk
fi

source ${toolchain_dir}/emsdk-portable/emsdk_env.sh


INCLUDES=-Imason_packages/.link/include/
DEFINES="--bind -s DISABLE_EXCEPTION_CATCHING=0 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS=['addOnPreMain']"
# -fsanitize=cfi
DEBUG_FLAGS="-O0 -g4"

RELEASE_FLAGS="-O3 -g0 -DNDEBUG --llvm-lto 3"

# -Wno-inline
CXXFLAGS="-std=c++14 -Wall"
LDFLAGS=""

#export EMCC_DEBUG=1
#export EMCC_WASM_BACKEND=1
# TODO: use wasm32-unknown-unknown
#export EMMAKEN_COMPILER=./mason_packages/osx-x86_64/llvm/5.0.0/bin/clang++
EMCC="emcc"

function run() {
    local directory=${1}
    local EXTRA_FLAGS=${2}
    mkdir -p ./${directory}
    ${EMCC} ${DEFINES} ${INCLUDES} ${EXTRA_FLAGS} ${CXXFLAGS} -x c++ -c -o ./${directory}/vtvalidate.bc src/wasm-init.cpp
    ${EMCC} ${DEFINES} ${LDFLAGS} ${EXTRA_FLAGS} -o ./${directory}/module.js ./${directory}/vtvalidate.bc 
}

#run build/profile-em "--profiling " && cp build/profile-em/module* ./html/
run build/release-em ${RELEASE_FLAGS} && cp build/release-em/module* ./html/
#run build/debug-em ${DEBUG_FLAGS} && cp build/debug-em/module* ./html/

: '
python -m SimpleHTTPServer
'