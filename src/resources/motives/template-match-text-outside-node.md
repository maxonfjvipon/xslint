# Text is outside the node

Text element can't be outside the node. Any text (except spaces) 
must be written in 'xsl:text'.

Incorrect:

```xsl
<xsl:if test=".!=''">
  Hello!
</xsl:if>
```

Correct:

```xsl
<xsl:if test=".!=''">
  <xsl:text>Hello!</xsl:text>
</xsl:if>
```
