<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" version="2.0">
  <xsl:template match="/objects/o/o[1]/o[1]">
    <xsl:variable name="oo" as="xs:string" select="expression">
    </xsl:variable>
    <xsl:copy-of select="."/>
  </xsl:template>
  <xsl:template match="/objects/o/o[1]/o[2]">
    <xsl:copy-of select="$oo"/>
  </xsl:template>
</xsl:stylesheet>
