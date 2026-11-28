import type { Thing, WithContext } from "schema-dts"; // optional: `npm i -D schema-dts`

type JsonLdProps<T extends Thing> = {
  data: WithContext<T> | Record<string, unknown>;
};

export function JsonLd<T extends Thing>({ data }: JsonLdProps<T>) {
  const safeJson = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}