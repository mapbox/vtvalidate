#include "vtvalidate.hpp"
#include "utils.hpp"

#include <exception>
#include <gzip/compress.hpp>
#include <gzip/decompress.hpp>
#include <gzip/utils.hpp>
#include <iostream>
#include <map>
#include <stdexcept>
#include <vtzero/vector_tile.hpp>

namespace VectorTileValidate {

struct geom_handler {

    void points_begin(uint32_t /*dummy*/) {}

    void points_point(const vtzero::point /*dummy*/) {}

    void points_end() const noexcept {}

    void linestring_begin(uint32_t /*dummy*/) {}

    void linestring_point(const vtzero::point /*dummy*/) {}

    void linestring_end() const noexcept {}

    void ring_begin(uint32_t /*dummy*/) {}

    void ring_point(const vtzero::point /*dummy*/) {}

    void ring_end(vtzero::ring_type /*dummy*/) const noexcept {}

}; // struct geom_handler

std::string parseTile(vtzero::data_view const& buffer) {
    std::string result;

    vtzero::vector_tile tile{buffer};
    try {
        while (auto layer = tile.next_layer()) {
            while (auto feature = layer.next_feature()) {
                // Detect geomtype of feature and decode
                geom_handler handler;
                vtzero::decode_geometry(feature.geometry(), handler);

                feature.for_each_property([&](vtzero::property const& p) {
                    p.key();
                    auto value = p.value();
                    switch (value.type()) {
                    case vtzero::property_value_type::string_value:
                        value.string_value();
                        break;
                    case vtzero::property_value_type::float_value:
                        value.float_value();
                        break;
                    case vtzero::property_value_type::double_value:
                        value.double_value();
                        break;
                    case vtzero::property_value_type::int_value:
                        value.int_value();
                        break;
                    case vtzero::property_value_type::uint_value:
                        value.uint_value();
                        break;
                    case vtzero::property_value_type::sint_value:
                        value.sint_value();
                        break;
                    case vtzero::property_value_type::bool_value:
                        value.bool_value();
                        break;
                    // LCOV_EXCL_START
                    default:
                        throw std::runtime_error("Invalid property value type"); // this can never happen, since vtzero handles the error earlier
                        // LCOV_EXCL_STOP
                    }
                    return true; // continue to next property
                });
            }
        }
    } catch (std::exception const& ex) {
        result = ex.what();
        return result;
    }

    result = "";
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
    std::string result_;
    vtzero::data_view data;
    // TODO(@flippmoke): research whether Nan::Global would be a better choice to avoid
    // the need to manually call Reset()
    Nan::Persistent<v8::Object> keep_alive_;

    AsyncValidateWorker(v8::Local<v8::Object> const& buffer, Nan::Callback* cb)
        : Base(cb, "vtvalidate:worker"),
          result_{""},
          data(node::Buffer::Data(buffer), node::Buffer::Length(buffer)),
          keep_alive_(buffer) {}

    // The Execute() function is getting called when the worker starts to run.
    // - You only have access to member variables stored in this worker.
    // - You do not have access to Javascript v8 objects here.
    void Execute() override {
        // The try/catch is critical here: if code was added that could throw an
        // unhandled error INSIDE the threadpool, it would be disastrous
        try {
            if (gzip::is_compressed(data.data(), data.size())) {
                gzip::Decompressor decompressor;
                std::string uncompressed;
                decompressor.decompress(uncompressed, data.data(), data.size());
                vtzero::data_view dv(uncompressed);
                result_ = parseTile(dv);
            } else {
                result_ = parseTile(data);
            }
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
        callback->Call(argc, static_cast<v8::Local<v8::Value>*>(argv), async_resource);
    }

    // explicitly use the destructor to clean up
    // the persistent tile ref by Reset()-ing
    ~AsyncValidateWorker() override {
        keep_alive_.Reset();
    }
};

NAN_METHOD(isValid) {

    // Check second argument, should be a 'callback' function.
    // This allows us to set the callback so we can use it to return errors
    // instead of throwing.
    // Also, "info" comes from the NAN_METHOD macro, which returns differently
    // according to the version of node
    if (!info[1]->IsFunction()) {
        return Nan::ThrowTypeError("second arg \"callback\" must be a function");
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
        utils::CallbackError("first arg \"buffer\" must be a Protobuf object", callback);
        return;
    }

    // Creates a worker instance and queues it to run asynchronously, invoking the
    // callback when done.
    // - Nan::AsyncWorker takes a pointer to a Nan::Callback and deletes the
    // pointer automatically.
    // - Nan::AsyncQueueWorker takes a pointer to a Nan::AsyncWorker and deletes
    // the pointer automatically.
    // TODO (@flippmoke): use unique_ptr here instead of a raw pointer?
    auto* worker = new AsyncValidateWorker{buffer, new Nan::Callback{callback}};
    Nan::AsyncQueueWorker(worker);
}
} // namespace VectorTileValidate
