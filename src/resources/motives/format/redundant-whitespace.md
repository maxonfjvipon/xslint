# Redundant whitespace

A bare XPath expression should read cleanly. Whitespace that the processor
ignores still costs the reader: a doubled space, a space hugging a parenthesis,
or a stray space at the start or end of the expression all add noise without
adding meaning. This check flags whitespace that can be removed without
changing what the expression selects.

A whitespace run is redundant when it is longer than a single space, or when it
sits at the very start or end of the expression. Whitespace inside a string
literal or a comment is left untouched — those spaces are part of the value the
author wrote on purpose. The check runs only over expressions that already
parse, so a malformed expression is reported once by the validator and never
nagged about its spacing.

Incorrect (a doubled space and a trailing space):

```xsl
<xsl:if test="foo(  a) = 'hello' ">
  <xsl:value-of select="."/>
</xsl:if>
```

Correct:

```xsl
<xsl:if test="foo(a) = 'hello'">
  <xsl:value-of select="."/>
</xsl:if>
```
