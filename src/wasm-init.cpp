#include "vtvalidate-wasm.hpp"
#include <emscripten/bind.h>

using namespace emscripten;
EMSCRIPTEN_BINDINGS(vtvalidate) {
    function("isValid", &vtvalidate_wasm::isValid);
}