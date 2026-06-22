# Using internal content and @select to set variable or param

`xsl:variable` and `xsl:parameter` have both select attribute and 
internal content. Need to leave only one of the ways to set the 
element. Otherwise, the definition of a `xsl:variable` or `xsl:parameter`
becomes ambiguous.

Incorrect:

```xsl
<xsl:variable name="physicist" select="'Isaac Newton'"/>
    Albert Einstein
</xsl:variable>
```
or:
```xsl
<xsl:param name="physicist" select="'J.J. Thomson'"/>
    Max Planck
</xsl:param>
```

Correct:

```xsl
<xsl:variable name="physicist">
    Marie Curie
</xsl:variable>
```
or:
```xsl
<xsl:variable name="physicist" select="'Ernest Rutherford'"/>
```
or:
```xsl
<xsl:param name="physicist">
    Galileo Galilei
</xsl:param>
```
or:
```xsl
<xsl:param name="physicist" select="'Lev Landau'"/>
```
