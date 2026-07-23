# Using `xsl:with-param` in invalid parent node

`xsl:with-param` is allowed within `xsl:call-template`, `xsl:apply-templates`,
`xsl:apply-imports`, `xsl:next-match` and `xsl:next-iteration`. `xsl:with-param` is needed to pass values
to the called template or to the applied templates. Otherwise it doesn't make sense.

Incorrect:

```xsl
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:with-param name="Kipling" select="1865"/>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:call-template name="myTemplate">
  <xsl:with-param name="Shakespeare" select="1564"/>
</xsl:call-template>
```
or:
```xsl
<xsl:apply-templates select="node">
  <xsl:with-param name="Austen" select="1775"/>
</xsl:apply-templates>
```
or:
```xsl
<xsl:apply-imports>
  <xsl:with-param name="Dickens" select="1812"/>
</xsl:apply-imports>
```
or:
```xsl
<xsl:next-match>
  <xsl:with-param name="Carroll" select="1832"/>
</xsl:next-match>
```

or:
```xsl
<xsl:next-iteration>
  <xsl:with-param name="Christie" select="1890"/>
</xsl:next-iteration>
```
