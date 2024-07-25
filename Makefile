.PHONY: default
default: cjs

.PHONY: rebuild
rebuild: clean cjs

.PHONY: clean
clean:
	rm -rf cjs types

node_modules:
	npm ci

.PHONY: lint
lint: node_modules
	node_modules/.bin/eslint src esm tests
	node_modules/.bin/prettier --check src esm tests

.PHONY: pretty
pretty: node_modules
	node_modules/.bin/eslint --fix src esm tests
	node_modules/.bin/prettier --write src esm tests

.PHONY: tests
tests:
	TS_NODE_PROJECT=tsconfig.test.json node --test --test-reporter spec --no-warnings --require ts-node/register tests/*.test.ts

.PHONY: tests/%
tests/%:
	TS_NODE_PROJECT=tsconfig.test.json node --test --test-reporter spec --no-warnings --require ts-node/register $@.test.ts

.PHONY: all
all: rebuild tests

cjs: node_modules
	node_modules/.bin/tsc
