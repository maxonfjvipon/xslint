# Using namespace axis

XPath 2.0 deprecated the `namespace::` axis, and support for it stopped being
something a stylesheet may count on. A processor must offer the axis only while
backwards compatible behaviour is enabled, which means an effective version of
1.0; anywhere else support is optional, and a processor that does not offer it
must reject the expression outright with a static error, `XPST0010`. So the same
stylesheet runs on one processor and fails to compile on the next, and there is
a system property, `xsl:supports-namespace-axis`, whose whole reason for
existing is to let a stylesheet ask which kind it is running on. Inspect
namespace bindings with the standard functions `in-scope-prefixes()` and
`namespace-uri-for-prefix()` instead, which every 2.0 processor has. In XSLT 1.0
the axis is guaranteed, so the concern begins at 2.0.

Incorrect:

```xsl
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  <xsl:template match="*">
    <xsl:for-each select="namespace::*">
      <xsl:value-of select="."/>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  <xsl:template match="*">
    <xsl:variable name="element" select="."/>
    <xsl:for-each select="in-scope-prefixes($element)">
      <xsl:value-of select="namespace-uri-for-prefix(., $element)"/>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
```

Which function replaces the axis depends on what the namespace node was read for:
its name is a prefix, its string value the namespace URI. A `namespace::*` walked
for its prefixes becomes `in-scope-prefixes(.)`; a `namespace::foo` read for its
URI becomes `namespace-uri-for-prefix('foo', .)`. Two cases need care:
`count(namespace::*)` becomes `count(in-scope-prefixes(.))`, but that raises a
type error on a context node that is not an element, where the axis merely
yielded nothing; and a `namespace::foo` copied by `xsl:copy-of` writes a
namespace node into the result tree, which no function returns — recreate it with
`xsl:namespace`, as
`<xsl:namespace name="foo" select="namespace-uri-for-prefix('foo', .)"/>`.

A `namespace::` step of a `match` pattern is a case apart, and neither function
reaches it: a pattern is matched by walking up from the node under test, so no
step of one is ever a function call. A template written `match="namespace::*"`
is restructured rather than rewritten — match the element and read its bindings
in the body, with the `in-scope-prefixes()` loop above. A predicate standing in
that same pattern holds an ordinary expression, so the axis in
`match="para[namespace::foo]"` becomes
`match="para[namespace-uri-for-prefix('foo', .)]"`.
