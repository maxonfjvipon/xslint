# Missing version in stylesheet

Every `xsl:stylesheet` should declare an `id` attribute with a unique value.
Without it, stylesheets are indistinguishable in logs, error messages, and
tooling that processes multiple stylesheets together.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- stylesheet logic -->
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" id="stylesheet_name">
  <!-- stylesheet logic -->
</xsl:stylesheet>
```
