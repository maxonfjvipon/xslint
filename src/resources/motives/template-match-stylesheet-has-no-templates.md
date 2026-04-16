# Stylesheet has no templates

A stylesheet without any `xsl:template` elements can produce no output. Add
at least one template to process the input document.

Incorrect:

```xsl
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  <xsl:variable name="title" select="'Hello'"/>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <p><xsl:value-of select="."/></p>
  </xsl:template>
</xsl:stylesheet>
```
