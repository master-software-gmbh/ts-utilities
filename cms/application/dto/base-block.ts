export type BaseBlock = {
  id: string;
  type: string;
  content: unknown;
  children: BaseBlock[];
};
