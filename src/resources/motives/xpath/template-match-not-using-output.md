# Not using output

Every stylesheet must declare `xsl:output` to specify the serialization format
explicitly. Omitting it leaves the output method implementation-defined and
leads to inconsistent results across processors.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:template match="/">
    <html>
      <body>
        <xsl:value-of select="."/>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" encoding="UTF-8"/>
  <xsl:template match="/">
    <html>
      <body>
        <xsl:value-of select="."/>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```
