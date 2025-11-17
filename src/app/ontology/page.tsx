/**
 * Ontology Page
 *
 * Comprehensive ontology management interface using the Ontology component
 * from the @captify-io/ontology package.
 */

"use client";

import { Ontology } from '@captify-io/ontology/client';

export default function OntologyPage() {
  return (
    <Ontology
      config={{
        defaultView: 'table',
        defaultEntityType: 'object',
      }}
    />
  );
}
