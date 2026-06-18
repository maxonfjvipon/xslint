# Name starts with a numeric character

Variable, template, and function names must not start with a digit. Such
names are invalid identifiers in XPath and XSLT.

Incorrect:

```xsl
<xsl:variable name="1st" select="'first'"/>
```

Correct:

```xsl
<xsl:variable name="first" select="'first'"/>
```
