# Empty `xsl:variable`

An `xsl:variable` gets its value either from a `@select` attribute or from the
sequence constructor inside it. With neither, the variable binds to an empty
string — almost always a mistake, and at best a confusing way to declare an
empty value. State the value explicitly or drop the declaration.

A variable that declares a type with `@as` is a different case and is not
flagged **from XSLT 2.0 on**: `<xsl:variable name="acc" as="node()*"/>` binds
the empty *sequence* of that type on purpose — a deliberate empty accumulator,
not an accidental empty string. The exclusion is version-scoped: in XSLT 1.0
`@as` is not a recognized attribute, so it is inert and the variable still binds
the empty string. A `1.0` stylesheet with an empty `@as` variable is therefore
still flagged — the `@as` does not do what its author expects.

Incorrect:

```xsl
<xsl:variable name="greeting"/>
```

Correct:

```xsl
<xsl:variable name="greeting" select="'hello'"/>
```

or:

```xsl
<xsl:variable name="greeting">hello</xsl:variable>
```

Also correct — a typed empty sequence in XSLT 2.0 or 3.0:

```xsl
<xsl:variable name="acc" as="node()*"/>
```
