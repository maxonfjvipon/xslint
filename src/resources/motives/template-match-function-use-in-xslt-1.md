# Function use in XSLT version 1.0

`xsl:function` does not exist in XSLT 1.0. Use a `xsl:template` with `name` attribute 
or upgrade the stylesheet version to 2.0.

Incorrect:

```xsl
  <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output encoding="UTF-8" method="xml"/>
     <xsl:function name="my:foo">
       <!-- body logic -->
     </xsl:function>
  </xsl:stylesheet>
```

Correct:

```xsl
  <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output encoding="UTF-8" method="xml"/>
     <xsl:template name="foo">
        <!-- body logic -->
     </xsl:template>
  </xsl:stylesheet>
```
or:
```xsl
  <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output encoding="UTF-8" method="xml"/>
     <xsl:function name="my:foo">
       <!-- body logic -->
     </xsl:function>
  </xsl:stylesheet>
```
