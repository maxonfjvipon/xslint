# Malformed stylesheet

A stylesheet that is not well-formed XML cannot be parsed into a document, so
nothing downstream can reason about it. It is reported once, and then skipped:
the other checks run only over the stylesheets that parse, so one broken file
never hides the feedback on the rest.

This is the first validator in the pipeline — validators establish that the
input is parseable, and the linters that follow assume it.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:template match="/">
    <result/>
  </xsl:template>
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:template match="/">
    <result/>
  </xsl:template>
</xsl:stylesheet>
```
