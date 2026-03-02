<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">
    <html>
      <body>
        <h2>My CD Collection</h2>
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>

  <xsl:variable name="county" as="xs:string" select="'RUSSIA'"/>

  <xsl:template match="cd">
    <p>
      <xsl:if test="./country=$county">
        <xsl:choose>
          <xsl:when test="price &lt; 8">
            <p>cheap</p>
          </xsl:when>
          <xsl:otherwise>
            <p>expensive</p>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates select="title"/>
        <xsl:apply-templates select="artist"/>
        <xsl:apply-templates select="year"/>
      </xsl:if>
    </p>
  </xsl:template>

  <xsl:template match="title">
    <xsl:call-template name="string">
      <xsl:with-param name="name" select="'Title'"/>
      <xsl:with-param name="color" select="'#ff0000'"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="artist">
    <xsl:call-template name="string">
      <xsl:with-param name="name" select="'Artist'"/>
      <xsl:with-param name="color" select="'#00ff00'"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="year">
    <xsl:call-template name="string">
      <xsl:with-param name="name" select="'Year'"/>
      <xsl:with-param name="color" select="'#00ffff'"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="string">
    <xsl:param name="name" select="'Unknown'"/>
    <xsl:param name="color" select="'#000000'"/>
    <xsl:value-of select="$name"/>: <span style="color:{$color}">
    <xsl:value-of select="."/></span>
    <br />
  </xsl:template>
</xsl:stylesheet>
