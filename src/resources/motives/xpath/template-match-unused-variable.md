# Unused variable

A variable that is declared but whose `$name` never appears in any attribute
value in the stylesheet is dead code and should be removed.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:variable name="greeting" select="'Hello'"/>
  <!-- $greeting is never referenced -->
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:variable name="greeting" select="'Hello'"/>
  <p>
    <xsl:value-of select="$greeting"/>
  </p>
</xsl:stylesheet>
```
