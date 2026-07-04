# Incorrect use of boolean constants

The strings `'true'` and `'false'` are non-empty strings that always evaluate
to boolean `true`. Use the XPath functions `true()` and `false()` instead.

Incorrect:

```xsl
<xsl:if test="@active = 'true'">
  <xsl:value-of select="."/>
</xsl:if>
```

Correct:

```xsl
<xsl:if test="@active = true()">
  <xsl:value-of select="."/>
</xsl:if>
```
