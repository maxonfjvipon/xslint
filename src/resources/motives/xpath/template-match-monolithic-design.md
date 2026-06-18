# Monolithic design

A stylesheet with only one template or function concentrates all logic in
one place, making it hard to read, test, and reuse. Split processing into
focused templates.

Incorrect:

```xsl
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <!-- all stylesheet logic in a single template -->
  </xsl:template>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <xsl:apply-templates select="header"/>
    <xsl:apply-templates select="section"/>
  </xsl:template>
  <xsl:template match="header">
    <h1><xsl:value-of select="."/></h1>
  </xsl:template>
  <xsl:template match="section">
    <p><xsl:value-of select="."/></p>
  </xsl:template>
</xsl:stylesheet>
```
