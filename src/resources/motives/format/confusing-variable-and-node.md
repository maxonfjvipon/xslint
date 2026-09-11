# Are you confusing a variable and a node?

When a variable and a node share the same name, using the bare name in
`select` silently picks the node child rather than the variable.

Incorrect:

```xsl
<xsl:template match="/">
  <xsl:variable name="title" select="'Hello'"/>
  <xsl:apply-templates select="title"/>
</xsl:template>
```

Correct:

```xsl
<xsl:template match="/">
  <xsl:variable name="title" select="'Hello'"/>
  <xsl:apply-templates select="$title"/>
</xsl:template>
```

A variable bound by *content* rather than by `select` is a different thing, and
a bare name standing beside one is usually right. Its nodes form a tree of
their own, parented by nothing in the source document, so they are members of
no `node()` the source yields. `node() except errors` subtracts the child
element it names; `node() except $errors` subtracts nothing at all, which turns
an identity transform that replaces an element into one that emits it twice:

```xsl
<xsl:template match="object">
  <xsl:variable name="errors" as="element()*">
    <xsl:apply-templates select="metas"/>
  </xsl:variable>
  <xsl:copy>
    <xsl:apply-templates select="(node() except errors)|@*"/>
  </xsl:copy>
</xsl:template>
```
