import type { TypeSpec } from "koffi";

export class SharedLibraryFunction {
  name: string;
  result: TypeSpec;
  arguments: TypeSpec[];
  
  constructor(name: string, args?: TypeSpec[], result?: TypeSpec) {
    this.name = name;
    this.arguments = args ?? [];
    this.result = result ?? 'int';
  }
}
