export class FileEntity {
  id: string;
  key: string;
  type: string;
  createdAt: Date;

  constructor(id: string, key: string, type: string, createdAt: Date) {
    this.id = id;
    this.key = key;
    this.type = type;
    this.createdAt = createdAt;
  }
}
