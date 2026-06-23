# Template has no @name or @match

AA template without the @name or @match attribute is not allowed.
Add at least one of these arguments, otherwise the template cannot
be applied.

Incorrect:

```xsl
<xsl:template>
  <--body-->
</xsl:template>
```

Correct:

```xsl
<xsl:template match="o/o">
  <--body-->
</xsl:template>
```
or:
```xsl
<xsl:template name="oo">
  <--body-->
</xsl:template>
```
or:
```xsl
<xsl:template name="oo" match="o/o">
  <--body-->
</xsl:template>
```
