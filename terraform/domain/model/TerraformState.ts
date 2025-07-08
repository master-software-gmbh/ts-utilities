import { randomUUID } from 'node:crypto';

export class TerraformState {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;

  constructor(data: {
    id?: string;
    name: string;
    content?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.name = data.name;
    this.content = data.content ?? '';
    this.id = data.id ?? randomUUID();
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}
