# Too many small templates

Having 10 or more templates that each contain fewer than 3 child elements
indicates excessive fragmentation. Consider merging related small templates
to improve readability.

Incorrect:

```xsl
<!-- 10 or more templates each with fewer than 3 child xsl:* elements -->
<xsl:template match="a"><xsl:value-of select="."/></xsl:template>
<xsl:template match="b"><xsl:value-of select="."/></xsl:template>
<xsl:template match="c"><xsl:value-of select="."/></xsl:template>
<!-- ... 7 or more similar templates ... -->
```

Correct:

```xsl
<xsl:template match="a|b|c|d|e|f|g|h|i|j">
  <xsl:value-of select="."/>
</xsl:template>
```
