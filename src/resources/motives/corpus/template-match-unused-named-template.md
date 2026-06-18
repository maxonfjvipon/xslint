# Unused named template

A named template that is never invoked via `xsl:call-template` is dead code
and should be removed.

This is a cross-file check: it looks at every stylesheet linted together, so
a template invoked from another file (via `xsl:import` or `xsl:include`) is
not reported. The template is flagged only when no file calls it. Lint the
whole project at once so the check can see every caller.

Incorrect:

```xsl
<xsl:template name="footer">
  <footer>Copyright 2026</footer>
</xsl:template>
<!-- xsl:call-template name="footer" never appears in this stylesheet -->
```

Correct:

```xsl
<xsl:template name="footer">
  <footer>Copyright 2026</footer>
</xsl:template>

<xsl:template match="/">
  <xsl:call-template name="footer"/>
</xsl:template>
```
