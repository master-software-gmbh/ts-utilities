import type { Hono } from 'hono';
import { loadModule } from '../../esm';
import { error, success, type Result } from '../../result';
import type { ImageTransformationService } from './interface';
import type { FileService } from '../../file';
import { sValidator } from '../../hono';
import { ImageTransformationOptions } from './dto/options';
import { logger } from '../../logging';

type Env = {
  Variables: {
    fileService: FileService;
    transformationService: ImageTransformationService;
  };
};

export async function createRouter(): Promise<Result<Hono<Env>, 'missing_dependencies'>> {
  const { data: hono } = await loadModule<typeof import('hono')>('hono');

  if (!hono) {
    return error('missing_dependencies');
  }

  const router = new hono.Hono<Env>().get(
    '/:id/transform',
    sValidator('query', ImageTransformationOptions),
    async (c) => {
      const id = c.req.param('id');
      const options = c.req.valid('query');
      const fileService = c.get('fileService');
      const service = c.get('transformationService');

      const file = await fileService.getFile(id);

      if (!file?.data) {
        return c.notFound();
      }

      const result = await service.transform(file.data, options);

      if (result.error) {
        logger.error('Image transformation failed', {
          fileId: id,
          error: result.error,
        });

        return c.body(result.error, 500);
      }

      return c.body(result.data);
    },
  );

  return success(router);
}
