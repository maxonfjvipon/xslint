<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" id="refused" version="2.0">
  <xsl:template match="alpha/(beta|gamma)">
    <xsl:value-of select="."/>
  </xsl:template>
  <xsl:template match="self::delta">
    <xsl:value-of select="."/>
  </xsl:template>
  <xsl:template match="epsilon" version="1.0">
    <xsl:value-of select="1 cast as xs:integer"/>
    <xsl:value-of select="1 +"/>
  </xsl:template>
  <xsl:template match="zeta" version="3.0">
    <xsl:value-of select="2 *"/>
  </xsl:template>
  <xsl:template match="following-sibling::eta">
    <xsl:value-of select="."/>
  </xsl:template>
</xsl:stylesheet>
