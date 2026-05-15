# Starts with double slash

Starting the `match` attribute of `xsl:template` with `//` forces the
processor to scan the entire document tree, which is expensive and rarely
necessary.

Incorrect:

```xsl
<xsl:template match="//item">
  <xsl:value-of select="."/>
</xsl:template>
```

Correct:

```xsl
<xsl:template match="item">
  <xsl:value-of select="."/>
</xsl:template>
```
