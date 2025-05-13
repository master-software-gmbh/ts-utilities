import type { BaseFactory } from '../../factory/base.ts';
import { XsAnnotationFactory } from '../../factory/xs/annotation.ts';
import { XsAnyAttributeFactory } from '../../factory/xs/any-attribute.ts';
import { XsAnyFactory } from '../../factory/xs/any.ts';
import { XsAppinfoFactory } from '../../factory/xs/appinfo.ts';
import { XsAttributeGroupFactory } from '../../factory/xs/attribute-group.ts';
import { XsAttributeFactory } from '../../factory/xs/attribute.ts';
import { XsChoiceFactory } from '../../factory/xs/choice.ts';
import { XsComplexContentFactory } from '../../factory/xs/complex-content.ts';
import { XsComplexTypeFactory } from '../../factory/xs/complex-type.ts';
import { XsDocumentationFactory } from '../../factory/xs/documentation.ts';
import { XsElementFactory } from '../../factory/xs/element.ts';
import { XsEnumerationFactory } from '../../factory/xs/enumeration.ts';
import { XsExtensionFactory } from '../../factory/xs/extension.ts';
import { XsImportFactory } from '../../factory/xs/import.ts';
import { XsIncludeFactory } from '../../factory/xs/include.ts';
import { XsMaxExclusiveFactory } from '../../factory/xs/max-exclusive.ts';
import { XsMaxLengthFactory } from '../../factory/xs/max-length.ts';
import { XsMinExclusiveFactory } from '../../factory/xs/min-exclusive.ts';
import { XsMinLengthFactory } from '../../factory/xs/min-length.ts';
import { XsPatternFactory } from '../../factory/xs/pattern.ts';
import { XsRestrictionFactory } from '../../factory/xs/restriction.ts';
import { XsSchemaFactory } from '../../factory/xs/schema.ts';
import { XsSequenceFactory } from '../../factory/xs/sequence.ts';
import { XsSimpleContentFactory } from '../../factory/xs/simple-content.ts';
import { XsSimpleTypeFactory } from '../../factory/xs/simple-type.ts';
import { XsTotalDigitsFactory } from '../../factory/xs/total-digits.ts';
import { XsUnionFactory } from '../../factory/xs/union.ts';
import type { XmlElement } from '../../model/xml/element.ts';
import type { XsAnnotation } from '../../model/xs/annotation.ts';
import type { XsAnyAttribute } from '../../model/xs/any-attribute.ts';
import type { XsAny } from '../../model/xs/any.ts';
import type { XsAppinfo } from '../../model/xs/appinfo.ts';
import type { XsAttributeGroup } from '../../model/xs/attribute-group.ts';
import type { XsAttribute } from '../../model/xs/attribute.ts';
import type { XsChoice } from '../../model/xs/choice.ts';
import type { XsComplexContent } from '../../model/xs/complex-content.ts';
import type { XsComplexType } from '../../model/xs/complex-type.ts';
import type { XsDocumentation } from '../../model/xs/documentation.ts';
import type { XsElement } from '../../model/xs/element.ts';
import type { XsEnumeration } from '../../model/xs/enumeration.ts';
import type { XsExtension } from '../../model/xs/extension.ts';
import type { XsImport } from '../../model/xs/import.ts';
import type { XsInclude } from '../../model/xs/include.ts';
import type { XsMaxExclusive } from '../../model/xs/max-exclusive.ts';
import type { XsMaxLength } from '../../model/xs/max-length.ts';
import type { XsMinExclusive } from '../../model/xs/min-exclusive.ts';
import type { XsMinLength } from '../../model/xs/min-length.ts';
import type { XsPattern } from '../../model/xs/pattern.ts';
import type { XsRestriction } from '../../model/xs/restriction.ts';
import type { XsSchema } from '../../model/xs/schema.ts';
import type { XsSequence } from '../../model/xs/sequence.ts';
import type { XsSimpleContent } from '../../model/xs/simple-content.ts';
import type { XsSimpleType } from '../../model/xs/simple-type.ts';
import type { XsTotalDigits } from '../../model/xs/total-digits.ts';
import type { XsUnion } from '../../model/xs/union.ts';
import type { XmlMapperContext } from '../context.ts';
import type { XmlMapperPlugin } from '../interface.ts';

type MapperResult =
  | XsSchema
  | XsAnnotation
  | XsAppinfo
  | XsImport
  | XsElement
  | XsComplexType
  | XsSimpleType
  | XsSequence
  | XsAttribute
  | XsAttributeGroup
  | XsChoice
  | XsInclude
  | XsRestriction
  | XsDocumentation
  | XsSimpleContent
  | XsExtension
  | XsEnumeration
  | XsPattern
  | XsMinLength
  | XsMaxLength
  | XsTotalDigits
  | XsUnion
  | XsMinExclusive
  | XsMaxExclusive
  | XsAny
  | XsAnyAttribute
  | XsComplexContent;

export class XmlSchemaMapperPlugin implements XmlMapperPlugin<MapperResult> {
  async map(element: XmlElement, context: XmlMapperContext): Promise<MapperResult | null> {
    if (element.namespace?.uri !== 'http://www.w3.org/2001/XMLSchema') {
      return null;
    }

    let factory: BaseFactory<MapperResult, unknown, unknown> | undefined;

    if (element.name === 'schema') {
      factory = new XsSchemaFactory();
    } else if (element.name === 'annotation') {
      factory = new XsAnnotationFactory();
    } else if (element.name === 'appinfo') {
      factory = new XsAppinfoFactory();
    } else if (element.name === 'import') {
      factory = new XsImportFactory();
    } else if (element.name === 'element') {
      factory = new XsElementFactory();
    } else if (element.name === 'complexType') {
      factory = new XsComplexTypeFactory();
    } else if (element.name === 'simpleType') {
      factory = new XsSimpleTypeFactory();
    } else if (element.name === 'sequence') {
      factory = new XsSequenceFactory();
    } else if (element.name === 'attribute') {
      factory = new XsAttributeFactory();
    } else if (element.name === 'attributeGroup') {
      factory = new XsAttributeGroupFactory();
    } else if (element.name === 'choice') {
      factory = new XsChoiceFactory();
    } else if (element.name === 'include') {
      factory = new XsIncludeFactory();
    } else if (element.name === 'restriction') {
      factory = new XsRestrictionFactory();
    } else if (element.name === 'documentation') {
      factory = new XsDocumentationFactory();
    } else if (element.name === 'simpleContent') {
      factory = new XsSimpleContentFactory();
    } else if (element.name === 'extension') {
      factory = new XsExtensionFactory();
    } else if (element.name === 'enumeration') {
      factory = new XsEnumerationFactory();
    } else if (element.name === 'pattern') {
      factory = new XsPatternFactory();
    } else if (element.name === 'minLength') {
      factory = new XsMinLengthFactory();
    } else if (element.name === 'maxLength') {
      factory = new XsMaxLengthFactory();
    } else if (element.name === 'totalDigits') {
      factory = new XsTotalDigitsFactory();
    } else if (element.name === 'union') {
      factory = new XsUnionFactory();
    } else if (element.name === 'minExclusive') {
      factory = new XsMinExclusiveFactory();
    } else if (element.name === 'maxExclusive') {
      factory = new XsMaxExclusiveFactory();
    } else if (element.name === 'any') {
      factory = new XsAnyFactory();
    } else if (element.name === 'anyAttribute') {
      factory = new XsAnyAttributeFactory();
    } else if (element.name === 'complexContent') {
      factory = new XsComplexContentFactory();
    }

    if (!factory) {
      return null;
    }

    const { data = null } = await factory.map(element, context);

    return data;
  }
}
