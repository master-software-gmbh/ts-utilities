import { loadModule } from '../../../esm';
import { logger } from '../../../logging';
import { type Result, error, success } from '../../../result';
import type { XmlAttribute } from '../../model/xml/attribute';
import type { XmlNamespaceDeclaration } from '../../model/xml/declaration';
import type { XmlElement } from '../../model/xml/element';
import type { XmlNamespace } from '../../model/xml/namespace';
import type { XmlSerializer } from '../interface';
import { DefaultNamespacePrefixes, type NamespaceMap, type XmlObject } from '../types';

export class FastXmlSerializer implements XmlSerializer {
  private readonly textNodeName = '#text';
  private readonly attributeNamePrefix = '';
  private readonly attributesGroupName = ':@';

  async serialize(object: XmlElement): Promise<Result<string, 'missing_dependencies'>> {
    const { data: module } = await loadModule<typeof import('fast-xml-parser')>('fast-xml-parser');

    if (!module) {
      return error('missing_dependencies');
    }

    const fastXmlBuilder = new module.XMLBuilder({
      format: true,
      ignoreAttributes: false,
      suppressEmptyNode: true,
      textNodeName: this.textNodeName,
      suppressBooleanAttributes: false,
      attributesGroupName: this.attributesGroupName,
      attributeNamePrefix: this.attributeNamePrefix,
    });
    
    const namespaces: NamespaceMap = {};
    const obj: XmlObject = {
      '?xml': {
        [this.attributesGroupName]: {
          'version': '1.0',
          'encoding': 'utf-8'
        },
      },
    };

    for (const declaration of object.declarations) {
      namespaces[declaration.namespace.uri] = declaration.prefix;
    }

    this.serializeElement(obj, object, namespaces);

    return success(fastXmlBuilder.build(obj));
  }

  private serializeElement(object: XmlObject, element: XmlElement, namespaces: NamespaceMap) {
    const elementObj = {
      [this.textNodeName]: '',
      [this.attributesGroupName]: {} as Record<string, string>,
    };

    const newNamespaces = this.updateNamespaceMap(elementObj, element, namespaces);

    for (const attribute of element.attributes) {
      this.addAttribute(elementObj, attribute, newNamespaces);
    }

    for (const child of element.children) {
      this.addChild(elementObj, child, newNamespaces);
    }

    const elementName = this.getLocalName(element, newNamespaces);
    const existingElements = object[elementName];

    if (Array.isArray(existingElements)) {
      existingElements.push(elementObj);
    } else {
      object[elementName] = [elementObj];
    }
  }

  private addDeclaration(obj: { ':@': Record<string, string> }, declaration: XmlNamespaceDeclaration) {
    let attributeName = `${this.attributeNamePrefix}xmlns`;

    if (declaration.prefix) {
      attributeName += `:${declaration.prefix}`;
    }

    obj[this.attributesGroupName][attributeName] = declaration.namespace.uri;
  }

  private addAttribute(obj: { ':@': Record<string, string> }, attribute: XmlAttribute, namespaces: NamespaceMap) {
    const qualifiedName = this.getLocalName(attribute, namespaces);
    const attributeName = `${this.attributeNamePrefix}${qualifiedName}`;
    obj[this.attributesGroupName][attributeName] = attribute.value;
  }

  private addChild(obj: XmlObject, child: XmlElement | string, namespaces: NamespaceMap) {
    if (typeof child === 'string') {
      obj[this.textNodeName] = child;
    } else {
      this.serializeElement(obj, child, namespaces);
    }
  }

  private getLocalName(element: { name: string; namespace?: XmlNamespace }, namespaces: NamespaceMap): string {
    if (element.namespace) {
      const prefix = namespaces[element.namespace.uri];

      if (prefix) {
        return `${prefix}:${element.name}`;
      }

      if (prefix === '') {
        return element.name;
      }

      logger.warn('Missing namespace prefix', {
        namespace: element.namespace.uri,
      });
    }

    return element.name;
  }

  private updateNamespaceMap(
    elementObj: { ':@': Record<string, string> },
    element: XmlElement,
    namespaces: NamespaceMap,
  ): NamespaceMap {
    const newNamespaces: NamespaceMap = { ...namespaces };

    for (const declaration of element.declarations) {
      this.addDeclaration(elementObj, declaration);
      newNamespaces[declaration.namespace.uri] = declaration.prefix;
    }

    if (element.namespace && !(element.namespace.uri in newNamespaces)) {
      const prefix = DefaultNamespacePrefixes[element.namespace.uri];

      if (!prefix) {
        throw new Error(`No default prefix found for namespace: ${element.namespace.uri}`);
      }

      newNamespaces[element.namespace.uri] = prefix;

      this.addDeclaration(elementObj, {
        namespace: element.namespace,
        prefix: prefix,
      });
    }

    return newNamespaces;
  }
}
