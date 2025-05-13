import type { BaseFactory } from '../../factory/base.ts';
import { XsStringFactory } from '../../factory/xs/string.ts';
import type { XmlElement } from '../../model/xml/element.ts';
import type { XsString } from '../../model/xs/string.ts';
import type { XmlMapperContext } from '../context.ts';
import type { XmlMapperPlugin } from '../interface.ts';

type MapperResult = XsString;

export class RefMapperPlugin implements XmlMapperPlugin<MapperResult> {
  async map(element: XmlElement, context: XmlMapperContext): Promise<MapperResult | null> {
    if (element.namespace?.uri !== 'http://www.xbrl.org/2006/ref') {
      return null;
    }

    let factory: BaseFactory<MapperResult, unknown, unknown> | undefined;

    if (element.name === 'Name') {
      factory = new XsStringFactory();
    } else if (element.name === 'Article') {
      factory = new XsStringFactory();
    } else if (element.name === 'IssueDate') {
      factory = new XsStringFactory();
    } else if (element.name === 'Paragraph') {
      factory = new XsStringFactory();
    } else if (element.name === 'Subparagraph') {
      factory = new XsStringFactory();
    } else if (element.name === 'Clause') {
      factory = new XsStringFactory();
    } else if (element.name === 'Subclause') {
      factory = new XsStringFactory();
    } else if (element.name === 'Number') {
      factory = new XsStringFactory();
    } else if (element.name === 'Note') {
      factory = new XsStringFactory();
    } else if (element.name === 'Publisher') {
      factory = new XsStringFactory();
    }

    if (!factory) {
      return null;
    }

    const { data = null } = await factory.map(element, context);

    return data;
  }
}
