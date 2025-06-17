import { randomUUID } from 'node:crypto';
import type { Context } from './Context';

export class Consent {
  id: string;
  status: string;
  subject: string;
  purpose: string;
  createdAt: Date;
  context: Context;

  constructor(data: {
    id?: string;
    status: string;
    subject: string;
    purpose: string;
    createdAt?: Date;
    context?: Context;
  }) {
    this.status = data.status;
    this.subject = data.subject;
    this.purpose = data.purpose;
    this.context = data.context ?? {};
    this.id = data.id ?? randomUUID();
    this.createdAt = data.createdAt ?? new Date();
  }
}
