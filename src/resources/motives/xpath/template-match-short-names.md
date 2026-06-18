# Short names

Single-character names for variables, functions, and templates reveal nothing
about their purpose, making stylesheets hard to read and maintain.

Incorrect:

```xsl
<xsl:variable name="x" select="'hello'"/>
```

Correct:

```xsl
<xsl:variable name="greeting" select="'hello'"/>
```
