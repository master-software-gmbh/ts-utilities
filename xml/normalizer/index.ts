import { logger } from '../../logging';
import type { XsSchema } from '../model/xs/schema';
import type { XmlNormalizerContext } from './context';
import { NormalizedSchema } from './schema';

export class XsSchemaNormalizer {
  private readonly schema: NormalizedSchema;

  constructor() {
    this.schema = new NormalizedSchema();
  }

  async normalize(schema: XsSchema, context: XmlNormalizerContext): Promise<NormalizedSchema> {
    const references = [...schema.imports, ...schema.includes];

    // Load referenced schemas
    // <xs:import> elements import schemas with other target namespaces
    // <xs:include> elements include schemas with the same target namespace

    for (const { schemaLocation } of references) {
      if (schemaLocation) {
        const { data } = await context.load(schemaLocation, context.base);

        if (!data) {
          logger.warn('Failed to load referenced schema', { schemaLocation });
          continue;
        }

        const namespace = data.schema.targetNamespace;

        if (!namespace) {
          logger.warn('Referenced schema has no target namespace', { schemaLocation });
          continue;
        }

        this.schema.addSchema(data.schema, schemaLocation, namespace);

        await this.normalize(data.schema, data.context);
      }
    }

    return this.schema;
  }
}
