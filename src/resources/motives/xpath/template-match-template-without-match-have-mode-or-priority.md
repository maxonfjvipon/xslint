# Use @mode or @priority in Template without @match

An `xsl:template` that has no `match` attribute must have no `mode` attribute
and no `priority` attribute. In a named template they have no meaning, since
it is called by name rather than selected among several templates.

Incorrect:

```xsl
<xsl:template name="oo" priority="2" mode="qq">
  <!--body-->
</xsl:template>
```
or:
```xsl
<xsl:template name="oo" mode="qq">
  <!--body-->
</xsl:template>
```
or:
```xsl
<xsl:template name="oo" priority="2">
  <!--body-->
</xsl:template>
```

Correct:

```xsl
<xsl:template name="oo" match="oo" mode="qq">
  <!--body-->
</xsl:template>
```
or:
```xsl
<xsl:template name="oo" match="oo" priority="2">
  <!--body-->
</xsl:template>
```
or:
```xsl
<xsl:template name="oo" match="oo" priority="2" mode="qq">
  <!--body-->
</xsl:template>
```
or:
```xsl
<xsl:template match="oo" priority="2" mode="qq">
  <!--body-->
</xsl:template>
```
or:
```xsl
<xsl:template match="oo" priority="2">
  <!--body-->
</xsl:template>
```
or:
```xsl
<xsl:template match="oo" mode="qq">
  <!--body-->
</xsl:template>
```
