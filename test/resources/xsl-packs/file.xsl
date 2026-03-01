<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" version="2.0">
  <xsl:template match="/objects/o/o[1]/o[1]">
    <xsl:copy-of select="."/>
  </xsl:template>
  <xsl:template match="/objects/o/o[1]/o[2]">
    <xsl:variable name="qw" as="xs:string" select="ooo"/>
    <xsl:copy-of select="$qw"/>
  </xsl:template>
</xsl:stylesheet>
