# TOFIX

Findings from a code scan on 2026-10-04.

## High

- `config/jschess.lua:1` - every demo page loads only `jschess.pack.min.js`, but `scripts/build_js.sh:42-45` makes the pack files plain copies of `jschess.js`/`jschess.min.js` (no Prototype, Raphael or chess.js bundled; `docs/jschess.pack.js` is byte-identical to `docs/jschess.js`). The pages call `document.observe` (e.g. `docs/index.html:45`) and the library uses `Class.create`/`Raphael(`, so the whole Pages site fails at load time; bundle the third-party libs into the pack variants or add `<script>` tags for them to the pages.
- `config/jschess.lua:5` - `JSCHESS_JS_SECTION_HIGHLIGHT` loads `third_party/highlight.min.js`/`.css` and `tera.templates/docs/tests.html.tera:12` and `:19` load `third_party/qunit.css`/`qunit.js`, but no `docs/third_party/` directory exists; these 404 (and `hljs.initHighlightingOnLoad()` throws). Vendor the files into `docs/third_party/` or point at a CDN.

## Medium

- `tera.templates/docs/index.html.tera:135` - links to `.../out/jschess.js`, `out/jschess.min.js`, `out/jschess.pack.js`, `out/jschess.zip` (lines 135-138) but Pages serves `docs/` and `out/` is gitignored, so all four are 404; link to `docs/jschess*.js` and publish the zip under `docs/` (or drop it).
- `tera.templates/docs/demo_using_min.html.tera:57` - "my download" links use `../out/web/third_party/...` (from `config/jschess.lua` `my_file`/`my_file_debug`) and lines 67/72 use `../out/jschess.min.js`/`../out/jschess.js`; none of these exist in the published site. Fix the paths together with the `out/` issue above.
- `tera.templates/docs/index.html.tera:176` - `<a href="{{ personal.EMAIL }}">` renders a relative link `mark.veltzer@gmail.com` (missing `mailto:`); same in every page footer (`demo_config.html.tera:33`, `demo_fen.html.tera:23`, `demo_controls.html.tera:41`, `tests.html.tera:23`, `demo_pgn.html.tera:30`, `calc.html.tera:49`, `demo_using_min.html.tera:86`). Use `mailto:{{ personal.EMAIL }}`.
- `tera.templates/docs/index.html.tera:112` - the tools list (lines 112-120) advertises jsl, jsmin, python, mako, GNU make and Closure Linter; the build is now rsconstruct + tera + yuicompressor + jsdoc (`rsconstruct.toml`, `scripts/build_js.sh`). Update the list to the real toolchain.
- `tera.templates/docs/index.html.tera:132` - clone link uses `git://github.com/...`; GitHub removed the unauthenticated git protocol in 2022. Use `https://github.com/....git`.
- `scripts/setup_env.sh:4` - uses deprecated `gnome-open` (use `xdg-open`) and opens `https://veltzer.org/~mark/jschess/web/debug.html`, a dead pre-Pages URL; point it at `https://veltzer.github.io/js-jschess/debug.html` or delete the script.

## Low

- `tera.templates/docs/demo_using_min.html.tera:65` - stray `&gt;` after the escaped third-party script block renders a dangling `>` in the code sample; remove it.
- `support/gjslint.cfg:1` - `support/gjslint.cfg`, `support/jsl.conf`, `support/jslintrc` and `support/releasemanager.cfg` are referenced by nothing in the build (`rsconstruct.toml`, `scripts/`); delete these leftovers.
- `scripts/build_js.sh:4` - comment says the processor lives in `rsconstruct.local.toml`, but it is defined in `rsconstruct.toml` (`[processor.explicit.jsbundle]`); fix the comment.
- `doc/TODO.txt:4` - TODO items refer to the removed Makefile (`.tdefs`, htmlhint wrapper, `check_all` target); prune stale entries.
