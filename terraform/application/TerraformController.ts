import { Hono } from 'hono';
import { MimeType } from '../../file';
import { logger } from '../../logging';
import { TerraformState } from '../domain/model/TerraformState';
import type { TerraformRepository } from './TerraformRepository';

export function createTerraformController(dependencies: {
  repository: TerraformRepository;
}) {
  return new Hono()
    .get('/:name', async (c) => {
      const name = c.req.param('name');
      const state = await dependencies.repository.findByName(name);

      if (!state) {
        logger.debug('Terraform state not found', {
          name: name,
        });

        return c.body(null, 404);
      }

      logger.info('Retrieving Terraform state', {
        name: state.name,
      });

      return c.body(state.content, 200, {
        'Content-Type': MimeType.applicationJson,
      });
    })
    .post('/:name', async (c) => {
      const name = c.req.param('name');
      const body = await c.req.text();

      let state = await dependencies.repository.findByName(name);

      if (!state) {
        logger.info('Creating new Terraform state', {
          name: name,
        });

        state = new TerraformState({
          name: name,
        });
      } else {
        logger.info('Updating existing Terraform state', {
          name: state.name,
        });
      }

      state.content = body;
      state.updatedAt = new Date();

      await dependencies.repository.save(state);

      return c.body(null, 200);
    })
    .delete('/:name', async (c) => {
      const name = c.req.param('name');

      logger.info('Deleting Terraform state', {
        name: name,
      });

      await dependencies.repository.deleteByName(name);

      return c.body(null, 204);
    });
}
