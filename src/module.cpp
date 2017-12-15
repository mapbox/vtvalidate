#include "vtvalidate.hpp"
#include <nan.h>

// "target" is a magic var that nodejs passes into a module's scope.
// When you write things to target, they become available to call from
// Javascript world.
static void init(v8::Local<v8::Object> target) {

    // expose isValid method
    Nan::SetMethod(target, "isValid", VectorTileValidate::isValid);
}

// Here we initialize the module (we only do this once)
// by attaching the init function to the module. This invokes
// a variety of magic from inside nodejs core that we don't need to
// worry about, but if you care the details are at https://github.com/nodejs/node/blob/34d1b1144e1af8382dad71c28c8d956ebf709801/src/node.h#L431-L518
// We mark this NOLINT to avoid the clang-tidy checks
// warning about code inside nodejs that we don't control and can't
// directly change to avoid the warning.
NODE_MODULE(module, init) // NOLINT