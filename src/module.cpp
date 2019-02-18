#include "vtvalidate.hpp"
#include <napi.h>

Napi::Object init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "isValid"), Napi::Function::New(env, VectorTileValidate::isValid));
    return exports;
}

NODE_API_MODULE(module, init) // NOLINT
