# Duplicate `xsl:param` name

The parameters of a template, a stylesheet function, or the stylesheet itself
form one namespace: each must have a distinct `@name`. Two parameters sharing a
name is a static error — the processor cannot tell which one a reference binds
to — and rejects the stylesheet.

Incorrect:

```xsl
<xsl:template name="render">
  <xsl:param name="size"/>
  <xsl:param name="size"/>
</xsl:template>
```

Correct:

```xsl
<xsl:template name="render">
  <xsl:param name="width"/>
  <xsl:param name="height"/>
</xsl:template>
```
