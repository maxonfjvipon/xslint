# Blank nested if

A nested `xsl:if` inside another `xsl:if` can always be collapsed into one
`xsl:if` by joining the conditions with `and`.

Incorrect:

```xsl
<xsl:if test="$a">
  <xsl:if test="$b">
    <xsl:value-of select="."/>
  </xsl:if>
</xsl:if>
```

Correct:

```xsl
<xsl:if test="$a and $b">
  <xsl:value-of select="."/>
</xsl:if>
```
