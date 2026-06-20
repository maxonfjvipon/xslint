# Missing version in stylesheet

Every `xsl:stylesheet` element must declare a `version` attribute to identify
the XSLT version the stylesheet conforms to. Omitting it produces an invalid
stylesheet that a conformant XSLT processor is required to reject.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- stylesheet logic -->
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <!-- stylesheet logic -->
</xsl:stylesheet>
```
