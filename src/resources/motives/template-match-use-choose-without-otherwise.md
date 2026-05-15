# Use choose without otherwise

An `xsl:choose` without an `xsl:otherwise` branch silently produces no output
when no `xsl:when` condition matches. Add `xsl:otherwise` to handle unexpected
values explicitly.

Incorrect:

```xsl
<xsl:choose>
  <xsl:when test="@type = 'a'">A</xsl:when>
  <xsl:when test="@type = 'b'">B</xsl:when>
</xsl:choose>
```

Correct:

```xsl
<xsl:choose>
  <xsl:when test="@type = 'a'">A</xsl:when>
  <xsl:when test="@type = 'b'">B</xsl:when>
  <xsl:otherwise>Unknown</xsl:otherwise>
</xsl:choose>
```
