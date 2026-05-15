# Can use abbreviated axis specifier

XSLT supports short forms for common axis specifiers: `child::` can be
omitted entirely, `attribute::` is abbreviated as `@`, and `parent::node()`
is written as `..`.

Incorrect:

```xsl
<xsl:value-of select="child::title"/>
<xsl:value-of select="attribute::name"/>
<xsl:apply-templates select="parent::node()"/>
```

Correct:

```xsl
<xsl:value-of select="title"/>
<xsl:value-of select="@name"/>
<xsl:apply-templates select=".."/>
```
