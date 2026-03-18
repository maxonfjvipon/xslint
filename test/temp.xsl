<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" version="2.0">
  <xsl:template match="o">
    <xsl:function name="my:tw" as="xs:string">
    </xsl:function>
  </xsl:template>
  <xsl:template match="/objects/o/o[1]/o[2]">
    <xsl:value-of select="my:tw()"/>
  </xsl:template>
</xsl:stylesheet>
