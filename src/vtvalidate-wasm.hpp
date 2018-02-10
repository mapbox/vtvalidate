//emscripten
#include <emscripten.h>
#include <emscripten/bind.h>

#include "vtvalidate-core.hpp"
#include <vtzero/vector_tile.hpp>

namespace vtvalidate_wasm {

EMSCRIPTEN_KEEPALIVE
std::string isValid(std::string const& str)
{
    vtzero::data_view data(str);
    return vtvalidate_core::parseTile(data);
}

}
