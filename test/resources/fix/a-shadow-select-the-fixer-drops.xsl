<?xml version="1.0" encoding="UTF-8"?>
<!--
* SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
* SPDX-License-Identifier: MIT
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="3.0">
  <xsl:template name="harbour">
    <xsl:param name="lantern" _select="{'Eddystone'}">
      <lantern>Beachy Head</lantern>
    </xsl:param>
    <xsl:variable name="beacon" _select="{'seven'}">
      <beacon>nine</beacon>
    </xsl:variable>
    <xsl:value-of select="$lantern"/>
    <xsl:value-of select="$beacon"/>
  </xsl:template>
  <xsl:template match="/harbour">
    <xsl:call-template name="harbour">
      <xsl:with-param name="lantern" _select="{'Skerryvore'}">
        <lantern>Bell Rock</lantern>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:template>
</xsl:stylesheet>
