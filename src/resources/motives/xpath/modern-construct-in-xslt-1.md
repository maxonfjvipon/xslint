# Modern construct in a 1.0 stylesheet

A stylesheet that declares `version="1.0"` must run on an XSLT 1.0 processor,
where the instructions and syntax introduced in XSLT 2.0 simply do not exist. A
1.0 processor (or Saxon-HE in 1.0 mode) rejects them, so a declared-1.0
stylesheet that reaches for a 2.0 construct is a real portability bug — it will
not run where its own version attribute promises it will.

This check flags a curated set of 2.0-only XSLT **instructions** —
`xsl:for-each-group`, `xsl:sequence`, `xsl:analyze-string`, `xsl:next-match`,
`xsl:perform-sort`, `xsl:namespace`, `xsl:character-map`, `xsl:result-document`,
`xsl:import-schema` — and the 2.0 **`as` sequence-type attribute** on any other
XSLT element, whenever the stylesheet declares version 1.0. Only elements in the
XSLT namespace are examined for
`@as`, so a literal result element that legitimately carries an `as` attribute —
`<link rel="preload" as="script"/>` in HTML output — is never mistaken for the
sequence-type attribute.

`xsl:function` is deliberately left out: it has its own check,
`function-use-in-xslt-1`, which also catches an unversioned or `1.1` stylesheet.
The 2.0 functions and operators that live *inside* XPath expressions
(`lower-case()`, `matches()`, `||`, `if/then/else`, `*:name`) are not flagged
yet — telling a reserved 2.0 built-in from a user-namespaced call needs
token-aware parsing, which waits on the full-fidelity parser (#228).

Either rewrite the construct with its 1.0 equivalent — a Muenchian grouping key
for `xsl:for-each-group`, a named template for `xsl:sequence` — or raise the
stylesheet to `version="2.0"`. Because that rewrite is structural, this check
reports without a `--fix`.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:template match="/objects">
    <xsl:for-each-group select="*" group-by="@key">
      <xsl:sequence select="current-group()"/>
    </xsl:for-each-group>
  </xsl:template>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:template match="/objects">
    <xsl:for-each-group select="*" group-by="@key">
      <xsl:sequence select="current-group()"/>
    </xsl:for-each-group>
  </xsl:template>
</xsl:stylesheet>
```
