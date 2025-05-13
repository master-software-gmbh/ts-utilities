import type { XsSchema } from '../model/xs/schema';

export class NormalizedSchema {
  private readonly schemas: {
    schema: XsSchema;
    schemaLocation: string;
    targetNamespace: string;
  }[];

  constructor() {
    this.schemas = [];
  }

  addSchema(schema: XsSchema, schemaLocation: string, targetNamespace: string) {
    this.schemas.push({ schema, schemaLocation, targetNamespace });
  }

  getNestedChildren<T>(get: (schema: XsSchema) => T[]): T[] {
    const schemas = this.getSchemas();
    return schemas.flatMap((schema) => get(schema));
  }

  getSchema(schemaLocation: string): XsSchema | undefined {
    return this.schemas.find((schema) => schema.schemaLocation === schemaLocation)?.schema;
  }

  getSchemas(namespace?: string): XsSchema[] {
    return this.schemas
      .filter((schema) => {
        if (!namespace) {
          return true;
        }

        return schema.targetNamespace === namespace;
      })
      .map((schema) => schema.schema);
  }
}
