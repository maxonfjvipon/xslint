# Missing version in stylesheet

The '@id' attribute is missing in the stylesheet. Add there 'id="your_stylesheet_name"'.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- stylesheet logic -->
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" id="stylesheet_name">
    <!-- stylesheet logic -->
</xsl:stylesheet>
```
