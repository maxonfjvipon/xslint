<?xml version="1.0" encoding="UTF-8"?>
<!--
* SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
* SPDX-License-Identifier: MIT
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0" id="targeted">
  <xsl:template match="/">
    <!-- xslint-disable-next-line short-names -->
    <xsl:variable name="x" select="1"/>
    <xsl:value-of select="$x"/>
  </xsl:template>
</xsl:stylesheet>
