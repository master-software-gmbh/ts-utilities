import type { XsComplexType } from '../../model/xs/complex-type';
import type { XsElement } from '../../model/xs/element';
import type { XsSchema } from '../../model/xs/schema';
import type { XsSequence } from '../../model/xs/sequence';

export interface XmlSchemaVisitor<T = void> {
  visitSchema: (schema: XsSchema) => T;
  visitElement: (element: XsElement) => T;
  visitSequence: (sequence: XsSequence) => T;
  visitComplexType: (complexType: XsComplexType) => T;
}
