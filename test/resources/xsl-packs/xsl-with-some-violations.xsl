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

    <xsl:variable name="c">
        <xsl:value-of select="'USA'"/>
    </xsl:variable>

    <xsl:template match="cd">
        <p>
            <xsl:if test="./country=$c">
                <xsl:apply-templates select="title"/>
                <xsl:apply-templates select="artist"/>
            </xsl:if>
            <xsl:choose>
                <xsl:when test="price &lt; 300">
                </xsl:when>
                <xsl:otherwise>
                </xsl:otherwise>
            </xsl:choose>
        </p>
    </xsl:template>

    <xsl:template match="//title">
        Title: <span style="color:#ff0000">
        <xsl:value-of select="."/></span>
        <br />
    </xsl:template>

    <xsl:template match="artist">
        Artist: <span style="color:#00ff00">
        <xsl:value-of select="."/></span>
        <br />
    </xsl:template>

    <xsl:template name="year">
        Artist: <span style="color:#0000ff">
        <xsl:value-of select="."/></span>
        <br />
    </xsl:template>
</xsl:stylesheet>
