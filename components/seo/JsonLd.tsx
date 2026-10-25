import React from "react";

/** Renders one or more JSON-LD blocks. `<` is escaped so data can't close the script tag. */
export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>
    {(Array.isArray(data) ? data : [data]).map((item, i) => (
      <script
        key={i}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(item).replace(/</g, "\\u003c"),
        }}
      />
    ))}
  </>
);
