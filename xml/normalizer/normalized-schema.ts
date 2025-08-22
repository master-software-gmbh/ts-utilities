import { LinkLinkbaseRef } from '../model/link/linkbase-ref';
import { LinkRoleType } from '../model/link/role-type';
import type { QName } from '../model/qualified-name';
import { XmlNamespace } from '../model/xml/namespace';
import { XsComplexType } from '../model/xs/complex-type';
import { XsElement } from '../model/xs/element';
import { XsRestriction } from '../model/xs/restriction';
import type { XsSchema } from '../model/xs/schema';
import { XsSimpleType } from '../model/xs/simple-type';

type TargetNamespaceUri = string;

export class NormalizedSchema {
  private readonly roleTypes: Map<TargetNamespaceUri, LinkRoleType[]>;
  private readonly linkbaseRefs: Map<TargetNamespaceUri, LinkLinkbaseRef[]>;
  private readonly elements: Map<TargetNamespaceUri, Map<string, XsElement>>;
  private readonly substitutions: Map<TargetNamespaceUri, Map<string, XsElement[]>>;
  private readonly types: Map<TargetNamespaceUri, Map<string, XsSimpleType | XsComplexType>>;

  constructor() {
    this.types = new Map();
    this.elements = new Map();
    this.roleTypes = new Map();
    this.linkbaseRefs = new Map();
    this.substitutions = new Map();
  }

  addSchema(schema: XsSchema) {
    if (!schema.targetNamespace) {
      throw new Error('Schema must have a target namespace');
    }

    const targetNamespace = new XmlNamespace(schema.targetNamespace);

    this.setTargetNamespace(targetNamespace.uri, schema);

    for (const element of schema.elements) {
      if (element.substitutionGroup) {
        const qname = element.element.resolveQName(element.substitutionGroup);

        if (!qname) {
          continue; // Skip if the QName cannot be resolved
        }

        this.addSubstitution(qname, element);
      }

      if (!element.name) {
        continue; // Skip if the element has no name or target namespace
      }

      this.addElement(
        {
          name: element.name,
          namespace: targetNamespace,
        },
        element,
      );

      for (const child of element.children) {
        if (child instanceof XsComplexType && child.name) {
          this.addType(
            {
              name: child.name,
              namespace: targetNamespace,
            },
            child,
          );
        } else if (child instanceof XsSimpleType && child.name) {
          this.addType(
            {
              name: child.name,
              namespace: targetNamespace,
            },
            child,
          );
        }
      }
    }

    for (const simpleType of schema.simpleTypes) {
      if (!simpleType.name) {
        continue;
      }

      this.addType(
        {
          name: simpleType.name,
          namespace: targetNamespace,
        },
        simpleType,
      );
    }

    for (const complexType of schema.complexTypes) {
      if (!complexType.name) {
        continue;
      }

      this.addType(
        {
          name: complexType.name,
          namespace: targetNamespace,
        },
        complexType,
      );
    }

    for (const annotation of schema.annotations) {
      for (const appinfo of annotation.appinfos) {
        for (const roleType of appinfo.getChildren(LinkRoleType)) {
          this.addRoleType(schema.targetNamespace, roleType);
        }

        for (const linkbaseRef of appinfo.getChildren(LinkLinkbaseRef)) {
          this.addLinkbaseRef(schema.targetNamespace, linkbaseRef);
        }
      }
    }
  }

  getElements(): XsElement[] {
    const elements: XsElement[] = [];

    for (const [_, elementMap] of this.elements.entries()) {
      elements.push(...elementMap.values());
    }

    return elements;
  }

  getElement(name: QName): XsElement | undefined {
    return this.elements.get(name.namespace.uri)?.get(name.name);
  }

  getType(name: QName): XsSimpleType | XsComplexType | undefined {
    return this.types.get(name.namespace.uri)?.get(name.name);
  }

  getSubstitutionGroup(name: QName): XsElement[] {
    return this.substitutions.get(name.namespace.uri)?.get(name.name) ?? [];
  }

  get allLinkbaseRefs(): LinkLinkbaseRef[] {
    const refs: LinkLinkbaseRef[] = [];

    for (const [_, linkbaseRefs] of this.linkbaseRefs.entries()) {
      refs.push(...linkbaseRefs);
    }

    return refs;
  }

  get allRoleTypes(): LinkRoleType[] {
    const roleTypes: LinkRoleType[] = [];

    for (const [_, roleTypes] of this.roleTypes.entries()) {
      roleTypes.push(...roleTypes);
    }

    return roleTypes;
  }

  private setTargetNamespace(targetNamespace: string | undefined, ...elements: unknown[]) {
    for (const element of elements) {
      if (element instanceof XsElement || element instanceof XsRestriction) {
        element.targetNamespace = targetNamespace;
      }

      if (typeof element === 'object' && element !== null && 'children' in element && Array.isArray(element.children)) {
        this.setTargetNamespace(targetNamespace, ...element.children);
      }
    }
  }

  private addElement(name: QName, element: XsElement) {
    if (!this.elements.has(name.namespace.uri)) {
      this.elements.set(name.namespace.uri, new Map());
    }

    this.elements.get(name.namespace.uri)?.set(name.name, element);
  }

  private addType(name: QName, type: XsSimpleType | XsComplexType) {
    if (!this.types.has(name.namespace.uri)) {
      this.types.set(name.namespace.uri, new Map());
    }

    this.types.get(name.namespace.uri)?.set(name.name, type);
  }

  private addSubstitution(name: QName, ...elements: XsElement[]) {
    if (!this.substitutions.has(name.namespace.uri)) {
      this.substitutions.set(name.namespace.uri, new Map());
    }

    if (!this.substitutions.get(name.namespace.uri)?.has(name.name)) {
      this.substitutions.get(name.namespace.uri)?.set(name.name, []);
    }

    this.substitutions
      .get(name.namespace.uri)
      ?.get(name.name)
      ?.push(...elements);
  }

  private addRoleType(namespace: string, roleType: LinkRoleType) {
    if (!this.roleTypes.has(namespace)) {
      this.roleTypes.set(namespace, []);
    }

    this.roleTypes.get(namespace)?.push(roleType);
  }

  private addLinkbaseRef(namespace: string, linkbaseRef: LinkLinkbaseRef) {
    if (!this.linkbaseRefs.has(namespace)) {
      this.linkbaseRefs.set(namespace, []);
    }

    this.linkbaseRefs.get(namespace)?.push(linkbaseRef);
  }
}
