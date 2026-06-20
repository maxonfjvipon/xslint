# Setting value of variable incorrectly

When the sole content of a variable is an `xsl:value-of` instruction, use
the `select` attribute shorthand instead. It is more concise and avoids
wrapping the value in a document fragment.

Incorrect:

```xsl
<xsl:variable name="title">
  <xsl:value-of select="heading"/>
</xsl:variable>
```

Correct:

```xsl
<xsl:variable name="title" select="heading"/>
```
