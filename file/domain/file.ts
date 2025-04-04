import { randomUUID } from 'crypto';

export class FileEntity {
  id: string;
  key: string;
  name: string;
  type: string;
  createdAt: Date;

  constructor(data: {
    id?: string;
    key: string;
    name: string;
    type: string;
    createdAt?: Date;
  }) {
    this.id = data.id ?? randomUUID();
    this.key = data.key;
    this.name = data.name;
    this.type = data.type;
    this.createdAt = data.createdAt ?? new Date();
  }
}
