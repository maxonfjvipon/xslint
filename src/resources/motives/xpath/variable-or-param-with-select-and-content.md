# Using internal content and @select to set variable or param

An xsl:variable or xsl:param must not set its value both ways.
When it carries a @select attribute and also has content, the
binding is ambiguous, so keep only one.

Incorrect:

```xsl
<xsl:variable name="physicist" select="'Isaac Newton'">
    Albert Einstein
</xsl:variable>
```
or:
```xsl
<xsl:param name="physicist" select="'J.J. Thomson'">
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
