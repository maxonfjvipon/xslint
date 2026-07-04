# Not creating element correctly

`xsl:element` with a static, literal name is unnecessarily verbose. Use a
literal result element directly, reserving `xsl:element` for cases where the
element name is dynamic (contains a variable reference, function call, or AVT).

Incorrect:

```xsl
<xsl:element name="div">
  <xsl:value-of select="."/>
</xsl:element>
```

Correct:

```xsl
<div>
  <xsl:value-of select="."/>
</div>
```
