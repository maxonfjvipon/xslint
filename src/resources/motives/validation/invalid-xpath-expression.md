# Invalid XPath expression

An attribute carrying a bare XPath expression — `select`, `test`, `use`,
`value`, `group-by`, `group-adjacent`, or the XSLT 3.0 `key`, `initial-value`,
`xpath`, `context-item`, `with-params`, `namespace-context` — must hold an
expression the processor can parse. A malformed expression breaks the
transformation at runtime, so the sooner it surfaces the better. Only the
expression syntax is checked, not its formatting; pattern attributes such as
`match` and attribute value templates are left to other checks.

The expression is parsed by the same engine that evaluates the rules, so it is
valid here exactly when the processor would accept it. Every prefix resolves
while parsing, so an unknown prefix or a custom function is never mistaken for
a syntax error: only genuine syntax mistakes are reported.

Incorrect (`==` is not an XPath operator):

```xsl
<xsl:if test="foo(a) == 'hello'">
  <xsl:value-of select="."/>
</xsl:if>
```

Correct:

```xsl
<xsl:if test="foo(a) = 'hello'">
  <xsl:value-of select="."/>
</xsl:if>
```
