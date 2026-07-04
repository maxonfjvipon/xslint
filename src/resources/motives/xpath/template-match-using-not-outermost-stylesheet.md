# Using not outermost stylesheet

`xsl:stylesheet` must be the outermost element of an XSLT document. A
nested `xsl:stylesheet` inside a template body is invalid and will be
rejected by a conformant XSLT processor.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    </xsl:stylesheet>
  </xsl:template>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html"/>
  <xsl:template match="/">
    <p>
      <xsl:value-of select="."/>
    </p>
  </xsl:template>
</xsl:stylesheet>
```
