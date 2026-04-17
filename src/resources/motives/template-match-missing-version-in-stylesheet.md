# Missing version in stylesheet

The '@version' attribute is missing in the stylesheet. Add there 'version="1.0"' or 'version="2.0"'"

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
