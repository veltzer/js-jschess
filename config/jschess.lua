JSCHESS_JS_SECTION = [[<script type="text/javascript" src="jschess.pack.min.js"></script>]]
JSCHESS_JS_SECTION_DEBUG = [[<script type="text/javascript" src="jschess.pack.js"></script>]]
JSCHESS_JS_SECTION_HIGHLIGHT = [[
        <!-- highlight.js -->
        <script type="text/javascript" src="third_party/highlight.min.js"></script>
        <link href="third_party/highlight.min.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript">hljs.initHighlightingOnLoad();</script>
    ]]
JSCHESS_GETJSTHIRDPARTY = [[<script type="text/javascript" src="out/web/third_party/prototype.min.js"></script>
<script type="text/javascript" src="out/web/third_party/raphael.min.js"></script>
<script type="text/javascript" src="out/web/third_party/chess.min.js"></script>]]
JSCHESS_GETJSTHIRDPARTY_ESCAPED = [[
&lt;script type=&quot;text/javascript&quot; src=&quot;out/web/third_party/prototype.min.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;out/web/third_party/raphael.min.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;out/web/third_party/chess.min.js&quot;&gt;&lt;/script&gt;]]
RUNTIMEDEPS = {
  {
    name = [[prototype]],
    version = [[1.7.3]],
    download_url = nil,
    download_url_debug = [[https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js]],
    documentation = [[http://prototypejs.org/learn]],
    my_file = [[out/web/third_party/prototype.min.js]],
    my_file_debug = [[out/web/third_party/prototype.js]],
  },
  {
    name = [[raphael]],
    version = [[2.2.0]],
    download_url = [[https://raw.githubusercontent.com/DmitryBaranovskiy/raphael/master/raphael.min.js]],
    download_url_debug = [[https://raw.githubusercontent.com/DmitryBaranovskiy/raphael/master/raphael.js]],
    documentation = [[http://raphaeljs.com/reference.html]],
    my_file = [[out/web/third_party/raphael.min.js]],
    my_file_debug = [[out/web/third_party/raphael.js]],
  },
  {
    name = [[chess.js]],
    version = [[0.10.2]],
    download_url = nil,
    download_url_debug = [[https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.2/chess.js]],
    documentation = [[https://github.com/jhlywa/chess.js/blob/master/README.md]],
    my_file = [[out/web/third_party/chess.min.js]],
    my_file_debug = [[out/web/third_party/chess.js]],
  },
}
