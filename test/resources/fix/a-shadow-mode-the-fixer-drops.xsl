<?xml version="1.0" encoding="UTF-8"?>
<!--
* SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
* SPDX-License-Identifier: MIT
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="3.0">
  <xsl:template name="harbour" _mode="{'quay'}">
    <xsl:value-of select="."/>
  </xsl:template>
  <xsl:template name="lighthouse" _priority="{'2'}">
    <xsl:value-of select="."/>
  </xsl:template>
</xsl:stylesheet>
