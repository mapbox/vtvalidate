MODULE_NAME := $(shell node -e "console.log(require('./package.json').binary.module_name)")

# Whether to turn compiler warnings into errors
export WERROR ?= true

default: release

node_modules/install:
	npm install --ignore-scripts

mason_packages/headers: node_modules/install
	node_modules/.bin/mason-js install

mason_packages/.link/include: mason_packages/headers
	node_modules/.bin/mason-js link

build-deps: mason_packages/.link/include

release: build-deps
	V=1 ./node_modules/.bin/node-pre-gyp configure build --error_on_warnings=$(WERROR) --loglevel=error
	@echo "run 'make clean' for full rebuild"

debug: mason_packages/.link/include
	V=1 ./node_modules/.bin/node-pre-gyp configure build --error_on_warnings=$(WERROR) --loglevel=error --debug
	@echo "run 'make clean' for full rebuild"

coverage: build-deps
	./scripts/coverage.sh

tidy: build-deps
	./scripts/clang-tidy.sh

format: build-deps
	./scripts/clang-format.sh

sanitize: build-deps
	./scripts/sanitize.sh

clean:
	rm -rf lib/binding
	rm -rf build
	# remove remains from running 'make coverage'
	rm -f *.profraw
	rm -f *.profdata
	@echo "run 'make distclean' to also clear node_modules, mason_packages, and .mason directories"

distclean: clean
	rm -rf node_modules
	rm -rf mason_packages
xcode: node_modules
	./node_modules/.bin/node-pre-gyp configure -- -f xcode

	@# If you need more targets, e.g. to run other npm scripts, duplicate the last line and change NPM_ARGUMENT
	SCHEME_NAME="$(MODULE_NAME)" SCHEME_TYPE=library BLUEPRINT_NAME=$(MODULE_NAME) BUILDABLE_NAME=$(MODULE_NAME).node scripts/create_scheme.sh
	SCHEME_NAME="npm test" SCHEME_TYPE=node BLUEPRINT_NAME=$(MODULE_NAME) BUILDABLE_NAME=$(MODULE_NAME).node NODE_ARGUMENT="`npm bin tape`/tape test/*.test.js" scripts/create_scheme.sh

	open build/binding.xcodeproj

docs:
	npm run docs

test:
	npm test

.PHONY: test docs
