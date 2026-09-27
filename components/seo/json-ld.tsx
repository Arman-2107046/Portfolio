/**
 * Emits a JSON-LD block.
 *
 * `JSON.stringify` cannot produce the `</script>` sequence that would close the
 * tag early, but it can produce `<` and `>` inside string values, so the two
 * characters are escaped. This is structured data assembled from content files,
 * not user input, but the cost of the escape is nothing and the failure mode it
 * prevents is script injection.
 */
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  const json = JSON.stringify(schema).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
