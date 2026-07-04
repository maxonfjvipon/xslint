# Redundant namespace declarations

A namespace prefix declared on the `xsl:stylesheet` element but never used by
any element name, attribute name, or qualified name inside an attribute value
is dead weight that misleads the reader and should be removed.

Incorrect:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="urn:foo" version="2.0">
  <!-- the foo prefix is never used anywhere -->
</xsl:stylesheet>
```

Correct:

```xsl
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <!-- only namespaces that are actually used are declared -->
</xsl:stylesheet>
```
