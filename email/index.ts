import { loadModule } from '../esm';
import { typedFetch } from '../http';
import { logger } from '../logging';
import { type Result, error, success } from '../result';
import { type EmailServerConfig, type Message, type MessageResponse, MessageResponseSchema } from './types';

export class TransactionalEmailService {
  private readonly config: EmailServerConfig;

  constructor(config: EmailServerConfig) {
    this.config = config;
  }

  async sendTransactionalEmail<T>(
    to: string,
    subject: string,
    content: {
      payload: T;
      renderText: (data: T) => string;
      renderHtml?: (data: T) => string;
    },
  ) {
    let htmlBody: string | undefined;

    if (content.renderHtml) {
      const result = await loadModule<typeof import('mjml')>('mjml');

      if (result.success) {
        const mjml = result.data;
        htmlBody = mjml(content.renderHtml(content.payload)).html;
      } else {
        logger.warn('Failed to load mjml module. Skipping HTML body.', {
          error: result.error,
        });
      }
    }

    return this.sendEmail({
      to: [to],
      subject: subject,
      html_body: htmlBody,
      from: this.config.fromAddress,
      plain_body: content.renderText(content.payload),
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
}
