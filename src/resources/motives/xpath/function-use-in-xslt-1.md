# Function use in a pre-2.0 stylesheet

`xsl:function` was introduced in XSLT 2.0. A stylesheet that declares
`version="1.0"` (or `1.1`) but defines an `xsl:function` cannot run on a 1.0
processor — the instruction does not exist there. What decides it is the
version in force over the function, which is the nearest one declared above it
rather than the root's: XSLT lets `version` sit on any of its own elements and
`xsl:version` on any literal result element, each setting the version of
everything beneath. So a `1.1` stylesheet is caught as plainly as an explicit
`1.0`, and one declaring no version at all names no processor to be wrong
about — a missing version is its own fault, reported as itself.

Either replace the function with an `xsl:template` that has a `name`, or raise
the stylesheet to `version="2.0"`.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:function name="my:foo">
    <!-- body logic -->
  </xsl:function>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:template name="foo">
    <!-- body logic -->
  </xsl:template>
</xsl:stylesheet>
```

or:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:function name="my:foo">
    <!-- body logic -->
  </xsl:function>
</xsl:stylesheet>
```
