import { XsComplexType } from '../../model/xs/complex-type';
import { XsElement } from '../../model/xs/element';
import type { XsSchema } from '../../model/xs/schema';
import { XsSequence } from '../../model/xs/sequence';
import type { XmlSchemaVisitor } from './interface';

export class FindElementVisitor implements XmlSchemaVisitor<XsElement | undefined> {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  visitSchema(schema: XsSchema): XsElement | undefined {
    for (const child of schema.children) {
      let element: XsElement | undefined;

      if (child instanceof XsElement) {
        element = this.visitElement(child);
      } else if (child instanceof XsComplexType) {
        element = this.visitComplexType(child);
      }

      if (element) {
        return element;
      }
    }
  }

  visitElement(element: XsElement): XsElement | undefined {
    if (element.name === this.name) {
      return element;
    }

    for (const child of element.children) {
      let element: XsElement | undefined;

      if (child instanceof XsComplexType) {
        element = this.visitComplexType(child);
      }

      if (element) {
        return element;
      }
    }
  }

  visitSequence(sequence: XsSequence): XsElement | undefined {
    for (const child of sequence.children) {
      if (child instanceof XsElement) {
        const element = this.visitElement(child);

        if (element) {
          return element;
        }
      }
    }
  }

  visitComplexType(complexType: XsComplexType): XsElement | undefined {
    for (const child of complexType.children) {
      if (child instanceof XsSequence) {
        const element = this.visitSequence(child);

        if (element) {
          return element;
        }
      }
    }
  }
}
