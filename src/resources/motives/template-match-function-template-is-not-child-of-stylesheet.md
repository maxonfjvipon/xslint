# Function or template is not child of stylesheet

`xsl:function` and `xsl:template` declaration can only appear as 
top-level elements (a child element of an `xsl:stylesheet`). 
Declaring them in other nodes is a syntax error.   

Incorrect:

```xsl
<xsl:template match="/">
  <!-- more than 50 xsl:* descendant elements -->
  <xsl:variable name="a" select="foo"/>
  <xsl:variable name="b" select="bar"/>
  <!-- ... many more elements ... -->
</xsl:template>
```

Correct:

```xsl
<xsl:template match="/">
  <xsl:apply-templates select="header"/>
  <xsl:apply-templates select="body"/>
</xsl:template>

<xsl:template match="header">
  <!-- header logic -->
</xsl:template>

<xsl:template match="body">
  <!-- body logic -->
</xsl:template>
```
