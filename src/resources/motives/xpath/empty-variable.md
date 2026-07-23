# Empty `xsl:variable`

An `xsl:variable` gets its value either from a `@select` attribute or from the
sequence constructor inside it. With neither, the variable binds to an empty
string — almost always a mistake, and at best a confusing way to declare an
empty value. State the value explicitly or drop the declaration.

Incorrect:

```xsl
<xsl:variable name="greeting"/>
```

Correct:

```xsl
<xsl:variable name="greeting" select="'hello'"/>
```

or:

```xsl
<xsl:variable name="greeting">hello</xsl:variable>
```
