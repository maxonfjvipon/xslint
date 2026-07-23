# Duplicate `xsl:with-param` name

A single `xsl:call-template`, `xsl:apply-templates`, `xsl:apply-imports`, or
`xsl:next-match` supplies each parameter at most once. Two `xsl:with-param`
children with matching `@name` is a static error — the processor cannot tell
which value to bind — and rejects the stylesheet.

Incorrect:

```xsl
<xsl:call-template name="render">
  <xsl:with-param name="colour" select="'red'"/>
  <xsl:with-param name="colour" select="'blue'"/>
</xsl:call-template>
```

Correct:

```xsl
<xsl:call-template name="render">
  <xsl:with-param name="colour" select="'red'"/>
  <xsl:with-param name="weight" select="'bold'"/>
</xsl:call-template>
```
