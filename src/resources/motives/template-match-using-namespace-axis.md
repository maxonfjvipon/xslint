# Using namespace axis

The `namespace::` axis is deprecated in XSLT 2.0. Use the standard functions
`fn:in-scope-prefixes()` and `fn:namespace-uri-for-prefix()` to inspect
namespace bindings instead.

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
    <xsl:for-each select="in-scope-prefixes(.)">
      <xsl:value-of select="namespace-uri-for-prefix(., current())"/>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
```
