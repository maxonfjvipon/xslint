# Function or template complexity

A function or template containing more than 50 XSLT elements is too complex
to read and maintain. Split it into smaller, focused units.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:template match="/">
    <!-- more than 50 xsl:* descendant elements -->
    <xsl:variable name="a" select="foo"/>
    <xsl:variable name="b" select="bar"/>
    <!-- ... many more elements ... -->
  </xsl:template>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:template match="/">
    <xsl:apply-templates select="header"/>
    <xsl:apply-templates select="body"/>
  </xsl:template>
  <xsl:template match="header">
    <!-- header logic -->
  </xsl:template>
  <xsl:template match="body">
    <!-- body logic -->
  </xsl:template>
</xsl:stylesheet>
```
