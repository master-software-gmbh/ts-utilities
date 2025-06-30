import { type InferOutput, number, object, record, string } from 'valibot';

export interface EmailServerConfig {
  url: string;
  token: string;
  fromAddress: string;
}

export interface Attachment {
  name: string;
  data: string;
  content_type: string;
}

export interface Message {
  to: string[];
  from: string;
  tag?: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  sender?: string;
  bounce?: boolean;
  reply_to?: string;
  plain_body: string;
  html_body?: string;
  attachments?: Attachment[];
  headers?: Record<string, string>;
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
