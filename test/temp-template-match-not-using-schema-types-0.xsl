<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0" id="style1">
  <xsl:output encoding="UTF-8" method="xml"/>
  <xsl:template match="/objects/o/o[1]/o[1]">
    <xsl:copy-of select="."/>
  </xsl:template>
  <xsl:template match="/objects/o/o[1]/o[2]">
    <xsl:copy-of select="."/>
  </xsl:template>
</xsl:stylesheet>
