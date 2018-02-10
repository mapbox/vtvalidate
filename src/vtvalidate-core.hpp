#pragma once

#include <exception>
#include <iostream>
#include <map>
#include <stdexcept>
#include <vtzero/vector_tile.hpp>

namespace vtvalidate_core {

namespace detail {

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
};

} // namespace detail

std::string parseTile(vtzero::data_view const& buffer) {
    std::string result;

    vtzero::vector_tile tile{buffer};
    try {
        while (auto layer = tile.next_layer()) {
            while (auto feature = layer.next_feature()) {
                // Detect geomtype of feature and decode
                detail::geom_handler handler;
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

} // namespace vtvalidate_core
