#pragma once
#include <nan.h>
// carrots, ex: <nan.h> --> look for header in global
// quotes, ex: "hello.hpp" --> look for header in location relative to this file

namespace VectorTileValidate {
NAN_METHOD(isValid);
}