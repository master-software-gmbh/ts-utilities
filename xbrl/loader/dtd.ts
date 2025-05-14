import { tmpdir } from 'os';
import { dirname, resolve } from 'path';
import { FileCache } from '../../cache';
import { type Result, success } from '../../result';
import { LinkbaseLoader } from '../../xml/loader/linkbase';
import { XmlSchemaLoader } from '../../xml/loader/schema';
import type { LinkLinkbase } from '../../xml/model/link/linkbase';
import { LinkLinkbaseRef } from '../../xml/model/link/linkbase-ref';
import type { XsSchema } from '../../xml/model/xs/schema';
import { Dtd } from '../model/dtd';

export class DtdLoader {
  async load(filepath: string): Promise<Result<Dtd, 'invalid_source'>> {
    const cache = new FileCache(resolve(tmpdir(), 'xbrl-cache'));
    const schemaLoader = new XmlSchemaLoader(filepath, cache);
    const schemaResult = await schemaLoader.load();

    if (!schemaResult.success) {
      return schemaResult;
    }

    // Load all linkbases
    const linkbaseLoader = new LinkbaseLoader(cache);

    const getLinkbaseRefs = (schema: XsSchema) =>
      schema.annotations.flatMap((annotation) =>
        annotation.appinfos.flatMap((appinfo) => appinfo.children.filter((child) => child instanceof LinkLinkbaseRef)),
      );

    const linkbaseRefs = schemaResult.data.getNestedChildren(getLinkbaseRefs);

    const linkbases: LinkLinkbase[] = [];

    for (const linkbaseRef of linkbaseRefs) {
      const path = resolve(dirname(filepath), linkbaseRef.href);
      const result = await linkbaseLoader.load(path);

      if (!result.success) {
        console.error('Error loading linkbase', result.error);
        continue;
      }

      linkbases.push(result.data);
    }

    return success(new Dtd(schemaResult.data, linkbases));
  }
}
