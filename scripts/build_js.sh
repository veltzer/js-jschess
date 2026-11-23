#!/bin/bash
# Package the jschess JS library from the tera-rendered sources in out/src.
# Invoked by rsconstruct ([processor.explicit.jsbundle] in
# rsconstruct.local.toml) as:
#   build_js.sh --inputs <files...> --output-files <files...> --output-dirs <dirs...>
# This replaces the pydmt-era Makefile pipeline:
# concatenate -> minify (yuicompressor) -> pack -> zip -> jsdoc.
set -euo pipefail

# Collect the out/src/*.js sources from --inputs, preserving rsconstruct's
# order (glob results sorted alphabetically) - the order decides the bytes
# of docs/jschess.js. The other declared inputs (package.json,
# support/jsdoc.json) are rebuild triggers, not sources.
sources=()
mode=""
for arg in "$@"; do
	case "${arg}" in
		--inputs) mode="inputs" ;;
		--output-files|--output-dirs) mode="" ;;
		*)
			if [ "${mode}" = "inputs" ]; then
				case "${arg}" in
					out/src/*.js) sources+=("${arg}") ;;
					*) ;; # only compiled sources are inputs
				esac
			fi
			;;
	esac
done

if [ "${#sources[@]}" -eq 0 ]; then
	echo "error: no out/src/*.js inputs passed" >&2
	exit 1
fi

# node_modules is gitignored; provision it when the tools are missing (CI).
if [ ! -x node_modules/.bin/yuicompressor ] || [ ! -x node_modules/.bin/jsdoc ]; then
	npm install --no-audit --no-fund
fi

cat "${sources[@]}" > docs/jschess.js
node_modules/.bin/yuicompressor docs/jschess.js -o docs/jschess.min.js
# The pack variants historically prepended a third-party dependency list
# (the Makefile's JS_DEPLIST), but that variable was never defined, so
# pack has always been identical to plain.
cp docs/jschess.js docs/jschess.pack.js
cp docs/jschess.min.js docs/jschess.pack.min.js

rm -f out/jschess.zip
zip -qr out/jschess.zip "${sources[@]}"

rm -rf docs/jsdoc
node_modules/.bin/jsdoc -d docs/jsdoc -c support/jsdoc.json out/src
