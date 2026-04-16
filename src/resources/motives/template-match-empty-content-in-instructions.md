# Empty content in instructions

Instruction elements such as `xsl:for-each`, `xsl:if`, `xsl:when`, and
`xsl:otherwise` with no content produce no output and are almost certainly
a mistake.

Incorrect:

```xsl
<xsl:for-each select="item">
</xsl:for-each>
```

Correct:

```xsl
<xsl:for-each select="item">
  <xsl:value-of select="."/>
</xsl:for-each>
```
