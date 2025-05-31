import type { StandardSchemaV1 } from '@standard-schema/spec';
import { forceSync } from '../../../async';
import { type Result, error, success } from '../../../result';
import type { XsElement } from '../../../xml/model/xs/element';

export abstract class BaseFactory<I, O> {
  abstract map(source: I): Result<O, 'validation_failed'>;

  protected parseAttribute<T>(
    source: XsElement,
    name: string,
    namespace: string,
    schema: StandardSchemaV1<unknown, T>,
  ): Result<T, 'validation_failed'> {
    const value = source.element.getAttribute(name, namespace)?.value;
    const result = forceSync(() => schema['~standard'].validate(value));

    if (result.issues) {
      return error('validation_failed');
    }

    return success(result.value);
  }
}
