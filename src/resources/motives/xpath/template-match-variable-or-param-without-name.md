# Using `xsl:variable` or `xsl:param` without @name

`xsl:variable` and `xsl:param` must have a required @name attribute.
`xsl:variable` and `xsl:param` cannot be used without it.

Incorrect:

```xsl
<xsl:variable>
  101
</xsl:variable>
```
or:
```xsl
<xsl:param>
  101
</xsl:param>
```
Correct:

```xsl
<xsl:variable name="qw">
  101
</xsl:variable>
```
or:
```xsl
<xsl:param name="qw">
  101
</xsl:param>
```
