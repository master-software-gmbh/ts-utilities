import type { Selectable } from 'kysely';
import { parse } from 'valibot';
import { logger } from '../../logging';
import type { DB } from '../database/types';
import { DocumentBlock } from '../domain/model/DocumentBlock';
import { FileBlock } from '../domain/model/FileBlock';
import { PlainTextBlock } from '../domain/model/PlainTextBlock';
import { RichTextBlock } from '../domain/model/RichTextBlock';
import type { StandardBlock } from '../domain/model/StandardBlock';
import { DocumentContentSchema, FileContentSchema, PlainTextContentSchema, RichTextContentSchema } from './schema';

export class CmsRepositoryMapper {
  static mapToEntity(root: Selectable<DB['cms_block']>, rows: Selectable<DB['cms_block']>[]): StandardBlock | null {
    const getChildren = (id: string) => rows.filter((block) => block.parent_id === id);

    type MapBlock = (row: Selectable<DB['cms_block']>) => StandardBlock | null;
    const mapBlock: MapBlock = (row: Selectable<DB['cms_block']>) => {
      if (row.type === 'plain-text') {
        const data = parse(PlainTextContentSchema, row.content);

        return new PlainTextBlock({
          id: row.id,
          content: data,
          position: row.position,
          parentId: row.parent_id,
          children: getChildren(row.id).compactMap(mapBlock),
        });
      }

      if (row.type === 'rich-text') {
        const data = parse(RichTextContentSchema, row.content);

        return new RichTextBlock({
          id: row.id,
          content: data,
          position: row.position,
          parentId: row.parent_id,
          children: getChildren(row.id).compactMap(mapBlock),
        });
      }

      if (row.type === 'file-ref') {
        const data = parse(FileContentSchema, row.content);

        return new FileBlock({
          id: row.id,
          content: data,
          position: row.position,
          parentId: row.parent_id,
          children: getChildren(row.id).compactMap(mapBlock),
        });
      }

      if (row.type === 'document') {
        const data = parse(DocumentContentSchema, row.content);

        return new DocumentBlock({
          id: row.id,
          content: data,
          position: row.position,
          parentId: row.parent_id,
          children: getChildren(row.id).compactMap(mapBlock),
        });
      }

      logger.warn('Unknown block type', {
        id: row.id,
        type: row.type,
      });

      return null;
    };

    return mapBlock(root);
  }
}
