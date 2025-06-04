import { randomUUID } from 'node:crypto';

export class Consent {
  id: string;
  status: string;
  subject: string;
  purpose: string;
  createdAt: Date;

  constructor(data: {
    id?: string;
    status: string;
    subject: string;
    purpose: string;
    createdAt?: Date;
  }) {
    this.status = data.status;
    this.subject = data.subject;
    this.purpose = data.purpose;
    this.id = data.id ?? randomUUID();
    this.createdAt = data.createdAt ?? new Date();
  }
}
