# XPath syntax newer than the XSLT version in force

A stylesheet's `version` is a promise about which processors can run it. XPath
grew with XSLT, so the same characters are a different language under a
different version: `1 cast as xs:integer` is an expression in XSLT 2.0 and, in
1.0, the name `cast` standing beside the name `as`. A pattern grew the same way,
and further — XSLT 3.0 rebuilt patterns on the expression grammar, admitting a
parenthesized step and the `self`, `descendant`, `descendant-or-self` and
`namespace` axes that no earlier version has. Reach for one of those under a
`version` that predates it and the stylesheet asks for a language its own
declaration says it will not use, which a conformant processor of the declared
version refuses to compile.

Such a stylesheet usually runs anyway, and that is what makes the defect worth
reporting rather than obvious. A 3.0 processor evaluates a `version="2.0"`
stylesheet exactly as if it said `version="3.0"`; only `version="1.0"` asks for
a real backwards compatible mode. So every modern processor loads the file, the
tests pass, and the promise is broken silently — until the stylesheet reaches a
processor of the version it declares, or a build pins one, and it fails to
compile there instead of at the desk of whoever wrote it. The syntax is not
malformed and the fault is not in the expression: the expression and the
`version` disagree, and either one of them can be the thing that moves.

So there are two hand-fixes, and which is right is a question about the
stylesheet rather than about the line. Raise the `version` to the one the
construct needs, if nothing depends on running under the older one — that is
the honest reading when the newer syntax was chosen deliberately. Or spell the
construct the way the declared version allows and keep the promise. A
parenthesized pattern step is a union of whole paths written short, so writing
the paths out restores it at any version; the `self::` axis of a pattern is the
node test standing alone; and an expression reaching for `cast as`, `intersect`
or `if/then/else` has a 1.0 equivalent in `number()`, a predicate over a union,
and a two-branch `xsl:choose`.

Incorrect (a parenthesized pattern step is XSLT 3.0, and this promises 2.0):

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:template match="metas/meta[head = 'also']/(tail|part)">
    <xsl:value-of select="."/>
  </xsl:template>
</xsl:stylesheet>
```

Correct (the same nodes, as the union of whole paths every version spells):

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:template match="metas/meta[head = 'also']/tail | metas/meta[head = 'also']/part">
    <xsl:value-of select="."/>
  </xsl:template>
</xsl:stylesheet>
```

Correct as well, where the stylesheet has no reason to stay at 2.0 (say what it
needs, and the pattern is legal as written):

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="3.0">
  <xsl:template match="metas/meta[head = 'also']/(tail|part)">
    <xsl:value-of select="."/>
  </xsl:template>
</xsl:stylesheet>
```
