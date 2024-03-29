#include "vtvalidate.hpp"
// gzip
#include <gzip/compress.hpp>
#include <gzip/decompress.hpp>
#include <gzip/utils.hpp>
// vtzero
#include <vtzero/vector_tile.hpp>
// stl
#include <exception>
#include <memory>

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
    vtzero::vector_tile tile{buffer};
    try {
        tile.for_each_layer([&](vtzero::layer const& layer) {
            layer.for_each_feature([&](vtzero::feature const& feature) {
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
                return true;
            });
            return true;
        });
    } catch (std::exception const& ex) {
        return ex.what();
    }
    return std::string{};
}

struct AsyncValidateWorker : Napi::AsyncWorker {
    using Base = Napi::AsyncWorker;
    AsyncValidateWorker(Napi::Buffer<char> const& buffer, Napi::Function& cb)
        : Base(cb),
          buffer_ref{Napi::Persistent(buffer)},
          data_{buffer.Data(), buffer.Length()} {}

    void Execute() override {
        // The try/catch is critical here: if code was added that could throw an
        // unhandled error INSIDE the threadpool, it would be disastrous
        try {
            if (gzip::is_compressed(data_.data(), data_.size())) {
                gzip::Decompressor decompressor;
                std::string uncompressed;
                decompressor.decompress(uncompressed, data_.data(), data_.size());
                vtzero::data_view dv(uncompressed);
                result_ = parseTile(dv);
            } else {
                result_ = parseTile(data_);
            }
        } catch (std::exception const& e) {
            SetError(e.what());
        }
    }

    std::vector<napi_value> GetResult(Napi::Env env) override {
        return {env.Null(), Napi::String::New(env, result_)};
    }

  private:
    Napi::Reference<Napi::Buffer<char>> buffer_ref;
    vtzero::data_view data_;
    std::string result_{};
};

Napi::Value isValid(Napi::CallbackInfo const& info) {

    Napi::Env env = info.Env();

    if (info.Length() != 2) {
        Napi::TypeError::New(env, "wrong number of arguments").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    // Check second argument, should be a 'callback' function.
    if (!info[1].IsFunction()) {
        Napi::TypeError::New(env, "second arg \"callback\" must be a function").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Function callback = info[1].As<Napi::Function>();

    // BUFFER: check first argument, should be a pbf object
    Napi::Object buffer_obj = info[0].As<Napi::Object>();
    if (buffer_obj.IsNull() || buffer_obj.IsUndefined()) {
        Napi::TypeError::New(env, "first arg is empty").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    if (!buffer_obj.IsBuffer()) {
        Napi::TypeError::New(env, "first arg \"buffer\" must be a Protobuf object").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Buffer<char> buffer = buffer_obj.As<Napi::Buffer<char>>();
    auto worker = new AsyncValidateWorker(buffer, callback);
    worker->Queue();
    return env.Undefined();
}
} // namespace VectorTileValidate
