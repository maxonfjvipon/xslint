# Unused function

A stylesheet function whose name never appears in any `match` or `select`
attribute is dead code and should be removed.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:function name="my:format">
    <xsl:param name="value"/>
    <xsl:value-of select="$value"/>
  </xsl:function>
  <!-- my:format is never referenced in match or select -->
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:function name="my:format">
    <xsl:param name="value"/>
    <xsl:value-of select="$value"/>
  </xsl:function>
  <xsl:template match="/">
    <p>
      <xsl:value-of select="my:format(title)"/>
    </p>
  </xsl:template>
</xsl:stylesheet>
```
