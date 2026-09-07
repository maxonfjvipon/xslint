# Using `xsl:with-param` in invalid parent node

`xsl:with-param` supplies a value to the template a caller is invoking, so it
means something only inside an instruction that invokes one: `xsl:call-template`,
`xsl:apply-templates`, `xsl:apply-imports`, `xsl:next-match` and
`xsl:next-iteration`. Standing anywhere else it names a parameter of no call at
all, and a processor refuses the whole module rather than reading past the
element — xsltproc reports `element with-param is not allowed within that
context`, Saxon raises `XTSE0010` — so one misplaced parameter costs the
stylesheet every transformation it was loaded for.

Which of those five may hold it depends on the version declared over it, which
is the nearest `version` on an ancestor XSLT element or `xsl:version` on a
literal result element, and so may be raised or lowered for one template rather
than the whole file. XSLT 1.0 defines `xsl:apply-imports` as empty; passing
parameters through it arrived with XSLT 2.0. A stylesheet declaring `1.0` and
passing one anyway does not compile on the 1.0 processor its own version
attribute promises it will run on, while a 2.0 processor reads the same file
without complaint — backwards compatible behaviour changes how expressions are
evaluated, not which children an element may carry — so the fault stays hidden
until the stylesheet moves. `xsl:next-match` and `xsl:next-iteration` are
themselves instructions XSLT 2.0 and 3.0 introduced, so in a 1.0 stylesheet the
fault is the instruction rather than the parameter inside it: the element has
nowhere to stand at all, and taking its parameter away leaves a 1.0 processor
refusing the same module for the same reason. The version condition therefore
concerns `xsl:apply-imports` alone — the one of the five that XSLT 1.0 does
define, and defines as empty.

Raise the declared version where no 1.0 processor has to run the stylesheet.
Where one does, the parameter has to go, and what it carried reaches the imported
template as a global `xsl:param` or as a value that template selects for itself.

Incorrect:

```xsl
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:with-param name="Kipling" select="1865"/>
</xsl:stylesheet>
```

Incorrect, since XSLT 1.0 gives `xsl:apply-imports` no parameter to take:

```xsl
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="poet">
    <xsl:apply-imports>
      <xsl:with-param name="Dickens" select="1812"/>
    </xsl:apply-imports>
  </xsl:template>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:call-template name="myTemplate">
  <xsl:with-param name="Shakespeare" select="1564"/>
</xsl:call-template>
```

or:

```xsl
<xsl:apply-templates select="node">
  <xsl:with-param name="Austen" select="1775"/>
</xsl:apply-templates>
```

or, once the version over it is 2.0 or later:

```xsl
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="poet">
    <xsl:apply-imports>
      <xsl:with-param name="Dickens" select="1812"/>
    </xsl:apply-imports>
  </xsl:template>
</xsl:stylesheet>
```

or:

```xsl
<xsl:next-match>
  <xsl:with-param name="Carroll" select="1832"/>
</xsl:next-match>
```

or:

```xsl
<xsl:next-iteration>
  <xsl:with-param name="Christie" select="1890"/>
</xsl:next-iteration>
```
