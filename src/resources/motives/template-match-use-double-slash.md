# Use double slash

Using `//` anywhere inside the `match` attribute of `xsl:template` forces
a full document scan and should be replaced with a more specific path.

Incorrect:

```xsl
<xsl:template match="root//item">
  <xsl:value-of select="."/>
</xsl:template>
```

Correct:

```xsl
<xsl:template match="item">
  <xsl:value-of select="."/>
</xsl:template>
```
