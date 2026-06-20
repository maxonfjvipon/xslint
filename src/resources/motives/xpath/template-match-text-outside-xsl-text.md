# Literal text outside `xsl:text`

Text element can't be outside the node. Any text (except spaces) must be written 
in `xsl:text` or in `xsl:variable`/`xsl:param`/`xsl:with-param` without 
`@select`, `xsl:attribute`, `xsl:comment`, `xsl:processing-instruction` 
and `xsl:message`. You can also use text inside HTML-tags.

Incorrect:

```xsl
<xsl:if test=".!=''">
  Hello!
</xsl:if>
```

Correct:

```xsl
<xsl:if test=".!=''">
  <xsl:text>Hello!</xsl:text>
</xsl:if>
```

or:
```xsl
<xsl:variable name="Lord Byron">
  1788-1824
</xsl:variable>
```

or:
```xsl
<xsl:param name="William Shakespeare">
  1564-1616
</xsl:param>
```

or:
```xsl
<xsl:with-param name="Robert Burns">
  1759-1796
</xsl:with-param>
```

or:
```xsl
<xsl:attribute-set name="font">
  <xsl:attribute name="fname"> 
    Arial 
  </xsl:attribute>
</xsl:attribute-set>
```

or:
```xsl
<xsl:comment>
  Text of comment.
</xsl:comment>
```

or:
```xsl
<xsl:processing-instruction name="xml-stylesheet">
    href="style.css" type="text/css"
</xsl:processing-instruction>
```

or:
```xsl
<xsl:message terminate="yes">
  text of message
</xsl:message>
```

or:
```xsl
<ul>
  <li>William Shakespeare</li>
  <li>Robert Burns</li>
  <li>Lord Byron</li>
</ul>
```