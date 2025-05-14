import type { QualifiedName } from '../model/qualified-name';
import type { XsComplexType } from '../model/xs/complex-type';
import type { XsElement } from '../model/xs/element';
import type { XsSchema } from '../model/xs/schema';
import type { XsSimpleType } from '../model/xs/simple-type';

export class NormalizedSchemaSet {
  private readonly schemas: {
    schema: XsSchema;
    schemaLocation: string;
    targetNamespace?: string;
  }[];

  constructor() {
    this.schemas = [];
  }

  hasSchema(schemaLocation: string): boolean {
    return this.schemas.some((schema) => schema.schemaLocation === schemaLocation);
  }

  add(schema: XsSchema, schemaLocation: string, targetNamespace?: string) {
    this.schemas.push({ schema, schemaLocation, targetNamespace });
  }

  getType(name: QualifiedName): XsSimpleType | XsComplexType | undefined {
    const schemas = this.getSchemas(name.namespace.uri);

    for (const schema of schemas) {
      const type = schema.getType(name.name);

      if (type) {
        return type;
      }
    }
  }

  getElement(name: QualifiedName): XsElement | undefined {
    const schemas = this.getSchemas(name.namespace.uri);

    for (const schema of schemas) {
      const element = schema.getElement(name.name);

      if (element) {
        return element;
      }
    }
  }

  getNestedChildren<T>(get: (schema: XsSchema) => T[]): T[] {
    const schemas = this.getSchemas();
    return schemas.flatMap((schema) => get(schema));
  }

  getSchema(schemaLocation: string): XsSchema | undefined {
    return this.schemas.find((schema) => schema.schemaLocation === schemaLocation)?.schema;
  }

  getSchemas(targetNamespace?: string): XsSchema[] {
    return this.schemas
      .filter((schema) => {
        if (!targetNamespace) {
          return true;
        }

        return schema.targetNamespace === targetNamespace;
      })
      .map((schema) => schema.schema);
  }
}
