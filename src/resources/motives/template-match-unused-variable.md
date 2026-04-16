# Unused variable

A variable that is declared but whose `$name` never appears in any attribute
value in the stylesheet is dead code and should be removed.

Incorrect:

```xsl
<xsl:variable name="greeting" select="'Hello'"/>
<!-- $greeting is never referenced -->
```

Correct:

```xsl
<xsl:variable name="greeting" select="'Hello'"/>
<p><xsl:value-of select="$greeting"/></p>
```
