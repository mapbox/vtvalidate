#include "vtvalidate.hpp"
#include "utils.hpp"

#include <exception>
#include <iostream>
#include <map>
#include <stdexcept>
#include <vtzero/vector_tile.hpp>

namespace VectorTileValidate {

struct geom_handler {

    std::vector<vtzero::point> point_data{};
    std::vector<std::vector<vtzero::point>> line_data{};

    void points_begin(uint32_t count) {
        point_data.reserve(count);
    }

    void points_point(const vtzero::point point) {
        point_data.push_back(point);
    }

    void points_end() const noexcept {
    }

    void linestring_begin(uint32_t count) {
        line_data.emplace_back();
        line_data.back().reserve(count);
    }

    void linestring_point(const vtzero::point point) {
        line_data.back().push_back(point);
    }

    void linestring_end() const noexcept {
    }

    void ring_begin(uint32_t count) {
        line_data.emplace_back();
        line_data.back().reserve(count);
    }

    void ring_point(const vtzero::point point) {
        line_data.back().push_back(point);
    }

    void ring_end(vtzero::ring_type /*dummy*/) const noexcept {
    }

}; // struct geom_handler


std::string parseTile(vtzero::vector_tile tile) {
    std::string result = "false";

    try {
        while (auto layer = tile.next_layer()) {
            while (auto feature = layer.next_feature()) {

                // Detect geomtype of feature
                geom_handler handler;
                vtzero::decode_geometry(feature.geometry(), handler);
            }
        }
    } catch (std::exception const& ex) {

        return result;
    }

    result = "true";
    return result;
}

// This is the worker running asynchronously and calling a user-provided
// callback when done.
// Consider storing all C++ objects you need by value or by shared_ptr to keep
// them alive until done.
// Nan AsyncWorker docs:
// https://github.com/nodejs/nan/blob/master/doc/asyncworker.md
struct AsyncValidateWorker : Nan::AsyncWorker {
    using Base = Nan::AsyncWorker;

    AsyncValidateWorker(v8::Local<v8::Object> buffer, Nan::Callback* cb)
        : Base(cb), 
        result_{""},
        data(node::Buffer::Data(buffer), node::Buffer::Length(buffer)), 
        tile_() {
            tile_.Reset(buffer.As<v8::Object>());
        }

    // The Execute() function is getting called when the worker starts to run.
    // - You only have access to member variables stored in this worker.
    // - You do not have access to Javascript v8 objects here.
    void Execute() override {
        // The try/catch is critical here: if code was added that could throw an
        // unhandled error INSIDE the threadpool, it would be disasterous
        try {
            vtzero::vector_tile tile{data};
            result_ = parseTile(tile);
        } catch (const std::exception& e) {
            SetErrorMessage(e.what());
        }
    }

    // The HandleOKCallback() is getting called when Execute() successfully
    // completed.
    // - In case Execute() invoked SetErrorMessage("") this function is not
    // getting called.
    // - You have access to Javascript v8 objects again
    // - You have to translate from C++ member variables to Javascript v8 objects
    // - Finally, you call the user's callback with your results
    void HandleOKCallback() override {
        Nan::HandleScope scope;

        const auto argc = 2u;
        v8::Local<v8::Value> argv[argc] = {
            Nan::Null(), Nan::New<v8::String>(result_).ToLocalChecked()};

        // Static cast done here to avoid 'cppcoreguidelines-pro-bounds-array-to-pointer-decay' warning with clang-tidy
        callback->Call(argc, static_cast<v8::Local<v8::Value>*>(argv));
    }

    // explicitly use the destructor to clean up
    // the persistent tile ref by Reset()-ing
    ~AsyncValidateWorker() {
        tile_.Reset();
    }

    std::string result_;
    vtzero::data_view data;
    Nan::Persistent<v8::Object> tile_;
};

NAN_METHOD(isValid) {

    // Check second argument, should be a 'callback' function.
    // This allows us to set the callback so we can use it to return errors
    // instead of throwing.
    // Also, "info" comes from the NAN_METHOD macro, which returns differently
    // according to the version of node
    if (!info[1]->IsFunction()) {
        return Nan::ThrowTypeError("second arg 'callback' must be a function");
    }
    v8::Local<v8::Function> callback = info[1].As<v8::Function>();

    // BUFFER: check first argument, should be a pbf object
    v8::Local<v8::Value> buffer_val = info[0];
    if (buffer_val->IsNull() ||
        buffer_val->IsUndefined()) {
        utils::CallbackError("first arg is empty", callback);
        return;
    }

    v8::Local<v8::Object> buffer = buffer_val->ToObject();

    if (buffer->IsNull() ||
        buffer->IsUndefined() ||
        !node::Buffer::HasInstance(buffer)) {
        utils::CallbackError("first arg 'buffer' must be a Protobuf object", callback);
        return;
    }

    // Creates a worker instance and queues it to run asynchronously, invoking the
    // callback when done.
    // - Nan::AsyncWorker takes a pointer to a Nan::Callback and deletes the
    // pointer automatically.
    // - Nan::AsyncQueueWorker takes a pointer to a Nan::AsyncWorker and deletes
    // the pointer automatically.
    auto* worker = new AsyncValidateWorker{buffer, new Nan::Callback{callback}};
    Nan::AsyncQueueWorker(worker);
}
} // namespace VectorTileValidate