# Not using schema types

XSLT 2.0 provides built-in XML Schema types (`xs:string`, `xs:integer`, etc.)
that make type expectations explicit and enable stronger compile-time
validation. Not using them when working in XSLT 2.0 mode misses this benefit.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <xsl:variable name="count" select="count(item)"/>
  </xsl:template>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" version="2.0">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <xsl:variable name="count" as="xs:integer" select="count(item)"/>
  </xsl:template>
</xsl:stylesheet>
```
