# Function or template is not child of stylesheet

`xsl:function` and `xsl:template` declaration can only appear as 
top-level elements (a child element of an `xsl:stylesheet`). 
Declaring them in other nodes is a syntax error.   

Incorrect:

```xsl
  <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0" id="style1">
    <xsl:output encoding="UTF-8" method="xml"/>
    <xsl:template match="/objects/o/o[1]/o[1]">
      <xsl:function name="my:factorial" as="xs:integer">
        <!-- function body -->
      </xsl:function>
    </xsl:template>
  </xsl:stylesheet>
```

Correct:

```xsl
  <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0" id="style1">
    <xsl:output encoding="UTF-8" method="xml"/>
    <xsl:template match="/objects/o/o[1]/o[1]">
        <!-- template body -->
    </xsl:template>
     <xsl:function name="my:factorial" as="xs:integer">
       <!-- function body -->
     </xsl:function>
  </xsl:stylesheet>
```
