# Unsorted imports

Unsorted `xsl:import` elements make it harder to scan for a specific import
and increase the chance of missing duplicates.

Incorrect:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:import href="/z.xsl"/>
  <xsl:import href="/x.xsl"/>
  <xsl:import href="/a.xsl"/>
</xsl:stylesheet>
```

Correct:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:import href="/a.xsl"/>
  <xsl:import href="/x.xsl"/>
  <xsl:import href="/z.xsl"/>
</xsl:stylesheet>
```
