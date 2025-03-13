import { number, object, record, string, type InferOutput } from 'valibot';

export interface EmailServerConfig {
  url: string;
  token: string;
  fromAddress: string;
}

export interface Attachment {
  name: string;
  content_type: string;
  data: string;
}

export interface Message {
  to: string[];
  from: string;
  subject: string;
  plain_body: string;
  cc?: string[];
  bcc?: string[];
  sender?: string;
  tag?: string;
  reply_to?: string;
  html_body?: string;
  attachments?: Attachment[];
  headers?: Record<string, string>;
  bounce?: boolean;
}

export const MessageResponseSchema = object({
  status: string(),
  time: number(),
  flags: object({}),
  data: object({
    message_id: string(),
    messages: record(
      string(),
      object({
        id: number(),
        token: string(),
      }),
    ),
  }),
});

export type MessageResponse = InferOutput<typeof MessageResponseSchema>;
