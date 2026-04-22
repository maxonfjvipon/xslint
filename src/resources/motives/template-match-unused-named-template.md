# Unused named template

A named template that is never invoked via `xsl:call-template` is dead code
and should be removed.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:template name="footer">
    <footer>Copyright 2026</footer>
  </xsl:template>
  <!-- xsl:call-template name="footer" never appears in this stylesheet -->
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:template name="footer">
    <footer>Copyright 2026</footer>
  </xsl:template>
  <xsl:template match="/">
    <xsl:call-template name="footer"/>
  </xsl:template>
</xsl:stylesheet>
```
