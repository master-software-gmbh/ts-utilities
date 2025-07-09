import { loadModule } from '../esm';
import type { FileEntity } from '../file';
import { typedFetch } from '../http';
import { logger } from '../logging';
import { type Result, error, success } from '../result';
import { type EmailServerConfig, type Message, type MessageResponse, MessageResponseSchema } from './types';

export class TransactionalEmailService {
  private readonly config: EmailServerConfig;

  constructor(config: EmailServerConfig) {
    this.config = config;
  }

  async sendTransactionalEmail(
    to: string,
    subject: string,
    plainBody: string,
    mjmlBody?: string,
    attachments: FileEntity[] = [],
  ) {
    let htmlBody: string | undefined;

    if (mjmlBody) {
      const result = await loadModule<typeof import('mjml')>('mjml');

      if (result.success) {
        const mjml = result.data;
        htmlBody = mjml(mjmlBody).html;
      } else {
        logger.warn('Failed to load mjml module. Skipping HTML body.', {
          error: result.error,
        });
      }
    }

    const convertedAttachments = await this.encodeAttachments(attachments);

    return this.sendEmail({
      to: [to],
      subject: subject,
      html_body: htmlBody,
      plain_body: plainBody,
      from: this.config.fromAddress,
      attachments: convertedAttachments,
    });
  }

  async sendEmail(message: Message): Promise<Result<MessageResponse, 'sending_failed'>> {
    const result = await typedFetch(
      this.config.url,
      {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
          'X-Server-API-Key': this.config.token,
          'Content-Type': 'application/json',
        },
      },
      (res) => res.json(),
      MessageResponseSchema,
    );

    if (!result.success) {
      logger.warn('Failed to send email', {
        error: result.error,
      });

      return error('sending_failed');
    }

    return success(result.data);
  }

  private async encodeAttachments(files: FileEntity[]) {
    return Promise.all(
      files.map(async (file) => {
        const data = await this.encodeFileStream(file.data.stream);

        return {
          data: data,
          name: file.name,
          content_type: file.type,
        };
      }),
    );
  }

  private async encodeFileStream(data: ReadableStream): Promise<string> {
    const text = await Bun.readableStreamToArrayBuffer(data);
    return Buffer.from(text).toString('base64');
  }
}
