# Use single option for choose

An `xsl:choose` with only one `xsl:when` branch is equivalent to `xsl:if`.
Use the simpler `xsl:if` instead.

Incorrect:

```xsl
<xsl:choose>
  <xsl:when test="@active">Active</xsl:when>
</xsl:choose>
```

Correct:

```xsl
<xsl:if test="@active">Active</xsl:if>
```
