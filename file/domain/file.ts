export class FileEntity {
  id: string;
  key: string;
  name: string;
  type: string;
  createdAt: Date;

  constructor(id: string, key: string, name: string, type: string, createdAt: Date) {
    this.id = id;
    this.key = key;
    this.name = name;
    this.type = type;
    this.createdAt = createdAt;
  }
}
