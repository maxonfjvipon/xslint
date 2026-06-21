# Use @mode or @priority in Template without @match

An `xsl:template` that has no `match` attribute must have no `mode` attribute
and no `priority` attribute. In named templates they have no sence, because it 
is not selected among several templates, instead it is called by name.

Incorrect:

```xsl
<xsl:template name="oo" priority="2" mode="qq">
  <--body-->
</xsl:template>
```
or:
```xsl
<xsl:template name="oo" mode="qq">
  <--body-->
</xsl:template>
```
or:
```xsl
<xsl:template name="oo" priority="2">
  <--body-->
</xsl:template>
```

Correct:

```xsl
<xsl:template name="oo" match="oo" mode="qq">
  <--body-->
</xsl:template>
```
or:
```xsl
<xsl:template name="oo" match="oo" priority="2">
  <--body-->
</xsl:template>
```
or:
```xsl
<xsl:template name="oo" match="oo" priority="2" mode="qq">
  <--body-->
</xsl:template>
```
or:
```xsl
<xsl:template match="oo" priority="2" mode="qq">
  <--body-->
</xsl:template>
```
or:
```xsl
<xsl:template match="oo" priority="2">
  <--body-->
</xsl:template>
```
or:
```xsl
<xsl:template match="oo" mode="qq">
  <--body-->
</xsl:template>
```

