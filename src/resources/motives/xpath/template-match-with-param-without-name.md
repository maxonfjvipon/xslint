# Using `xsl:with-param` without @name

`xsl:with-param` passes a value to a named parameter of the template, function,
or mode it invokes. The @name attribute is what binds the value to that
parameter, so it is required: without it the processor has no parameter to bind
to and rejects the stylesheet.

Incorrect:

```xsl
<xsl:call-template name="render">
  <xsl:with-param select="'red'"/>
</xsl:call-template>
```

Correct:

```xsl
<xsl:call-template name="render">
  <xsl:with-param name="colour" select="'red'"/>
</xsl:call-template>
```
