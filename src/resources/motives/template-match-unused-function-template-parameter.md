# Unused function or template parameter

A parameter declared in a function or template but never referenced in its
body is dead code and should be removed or used.

Incorrect:

```xsl
<xsl:template name="greet">
  <xsl:param name="name"/>
  <p>Hello</p>
</xsl:template>
```

Correct:

```xsl
<xsl:template name="greet">
  <xsl:param name="name"/>
  <p>
    <xsl:value-of select="concat('Hello, ', $name)"/>
  </p>
</xsl:template>
```
