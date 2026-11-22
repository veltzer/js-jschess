-- The third-party libraries jschess runs on, which a page loads before jschess
-- itself, from cdnjs (each at the version jschess is tested with).
local CDN = "https://cdnjs.cloudflare.com/ajax/libs/"

RUNTIMEDEPS = {
  {
    name = [[prototype]],
    version = [[1.7.3]],
    url = CDN .. "prototype/1.7.3/prototype.min.js",
    url_debug = CDN .. "prototype/1.7.3/prototype.js",
    documentation = [[http://prototypejs.org/learn]],
  },
  {
    name = [[raphael]],
    version = [[2.3.0]],
    url = CDN .. "raphael/2.3.0/raphael.min.js",
    url_debug = CDN .. "raphael/2.3.0/raphael.js",
    documentation = [[https://dmitrybaranovskiy.github.io/raphael/reference.html]],
  },
  {
    name = [[chess.js]],
    version = [[0.10.3]],
    url = CDN .. "chess.js/0.10.3/chess.min.js",
    url_debug = CDN .. "chess.js/0.10.3/chess.js",
    documentation = [[https://github.com/jhlywa/chess.js/blob/master/README.md]],
  },
}

-- a <script> tag for src, and the same escaped to be shown on a page
local function script(src)
  return '<script type="text/javascript" src="' .. src .. '"></script>'
end
local function escaped(src)
  return "&lt;script type=&quot;text/javascript&quot; src=&quot;" .. src .. "&quot;&gt;&lt;/script&gt;"
end

local function tags(field, render, sep)
  local out = {}
  for _, dep in ipairs(RUNTIMEDEPS) do
    out[#out + 1] = render(dep[field])
  end
  return table.concat(out, sep)
end

-- the libraries, then jschess: what every demo page loads (minified, or the debug builds)
JSCHESS_JS_SECTION = tags("url", script, "\n\t\t") .. "\n\t\t" .. script("jschess.min.js")
JSCHESS_JS_SECTION_DEBUG = tags("url_debug", script, "\n\t\t") .. "\n\t\t" .. script("jschess.js")
-- the libraries as a page using jschess imports them, shown on the "using" pages
JSCHESS_GETJSTHIRDPARTY_ESCAPED = "\n" .. tags("url", escaped, "\n")
-- highlight.js, which colours the demo pages' code samples
JSCHESS_JS_SECTION_HIGHLIGHT = '<link href="' .. CDN .. 'highlight.js/11.9.0/styles/default.min.css"'
  .. ' rel="stylesheet" type="text/css" />\n\t\t'
  .. script(CDN .. "highlight.js/11.9.0/highlight.min.js") .. "\n\t\t"
  .. '<script type="text/javascript">'
  .. "document.addEventListener('DOMContentLoaded', function() { hljs.highlightAll(); });</script>"
-- QUnit, for the tests page
JSCHESS_QUNIT = '<link type="text/css" rel="stylesheet" href="' .. CDN .. 'qunit/2.20.0/qunit.min.css"/>\n\t\t'
  .. script(CDN .. "qunit/2.20.0/qunit.min.js")
