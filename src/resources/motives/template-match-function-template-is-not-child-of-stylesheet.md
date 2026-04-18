# SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
# SPDX-License-Identifier: MIT
---
xpath: /xsl:stylesheet/*//(xsl:function|xsl:template)
severity: warning
message: "Boolean constants 'true' and 'false' are non-empty strings, not booleans. Use true() and false() instead."
