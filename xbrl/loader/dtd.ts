import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { type Cache, FileStorageCache } from '../../cache';
import { logger } from '../../logging';
import { type Result, success } from '../../result';
import { type FileContent, FilesystemStorageBackend, Folder } from '../../storage';
import type { NormalizedSchema } from '../../xml';
import { LinkbaseLoader } from '../../xml/loader/linkbase';
import { XmlSchemaLoader } from '../../xml/loader/schema';
import type { LinkLinkbase } from '../../xml/model/link/linkbase';
import { Dtd } from '../model/dtd';

export class DtdLoader {
  private readonly cache: Cache<string, FileContent>;
  private readonly schemaLoader: XmlSchemaLoader;

  constructor() {
    const backend = new FilesystemStorageBackend(new Folder(tmpdir(), 'xbrl-cache'));
    this.cache = new FileStorageCache(backend);
    this.schemaLoader = new XmlSchemaLoader(this.cache);
  }
  /**
   * Loads a Discoverable Taxonomy Set (DTD) from the entrypoint.
   * An entry point is a set of URLs that define a logical starting point for the DTS discovery process.
   * @see https://www.xbrl.org/Specification/taxonomy-package/CR-2015-06-10/taxonomy-package-CR-2015-06-10.html
   * @param filepaths - One or more filepaths
   */
  async load(...filepaths: string[]): Promise<Result<Dtd, 'invalid_source'>> {
    const result = await this.loadSchema(filepaths, this.cache);

    if (!result.success) {
      logger.error('Error loading schema', { error: result.error });
      return result;
    }

    return success(new Dtd(result.data.schema, result.data.linkbases));
  }

  private async loadSchema(
    filepaths: string[],
    cache: Cache<string, FileContent>,
  ): Promise<
    Result<
      {
        schema: NormalizedSchema;
        linkbases: LinkLinkbase[];
      },
      'invalid_source'
    >
  > {
    const schemaResult = await this.schemaLoader.load(...filepaths);

    if (!schemaResult.success) {
      return schemaResult;
    }

    // Load all linkbases
    const linkbaseLoader = new LinkbaseLoader(cache);

    const linkbases: LinkLinkbase[] = [];

    for (const linkbaseRef of schemaResult.data.allLinkbaseRefs) {
      let success = false;

      // TODO Implement proper linkbase resolution based on the original schema's location

      for (const filepath of filepaths) {
        const path = resolve(dirname(filepath), linkbaseRef.href);
        const result = await linkbaseLoader.load(path);

        if (result.success) {
          success = true;
          linkbases.push(result.data);
        }
      }

      if (!success) {
        logger.error('Error loading linkbase', { href: linkbaseRef.href });
      }
    }

    return success({
      schema: schemaResult.data,
      linkbases: linkbases,
    });
  }
}
