# Use node-set extension

The `exsl:node-set()` extension function is an XSLT 1.0 workaround for
converting result tree fragments into node-sets. It is unnecessary in XSLT 2.0
where temporary trees can be queried directly.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:exsl="http://exslt.org/common" version="2.0">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <xsl:variable name="nodes">
      <item>A</item>
    </xsl:variable>
    <xsl:for-each select="exsl:node-set($nodes)/item">
      <p>
        <xsl:value-of select="."/>
      </p>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <xsl:variable name="nodes">
      <item>A</item>
    </xsl:variable>
    <xsl:for-each select="$nodes/item">
      <p>
        <xsl:value-of select="."/>
      </p>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
```
