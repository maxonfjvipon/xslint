# Can use abbreviated axis specifier

XSLT supports short forms for common axis specifiers: `child::` can be
omitted entirely, `attribute::` is abbreviated as `@`, and `parent::node()`
is written as `..`.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0" id="style1">
  <xsl:value-of select="child::title"/>
  <xsl:value-of select="attribute::name"/>
  <xsl:apply-templates select="parent::node()"/>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0" id="style1">
  <xsl:value-of select="title"/>
  <xsl:value-of select="@name"/>
  <xsl:apply-templates select=".."/>
</xsl:stylesheet>
```
