import * as koffi from 'koffi';
import type { SharedLibraryFunction } from './SharedLibraryFunction';
import { logger } from '../logging';

export abstract class SharedLibrary {
  private library?: koffi.IKoffiLib;
  private readonly libraryFilepath: string;

  constructor(libraryFilepath: string) {
    this.libraryFilepath = libraryFilepath;
  }

  decode(data: unknown, groesse: number): Uint8Array<ArrayBuffer> {
    return koffi.decode(data, koffi.array('uint8', groesse));
  }

  protected callFunction(definition: SharedLibraryFunction, args = [] as unknown[]) {
    const library = this.getSharedLibrary();
    const func = library.func(definition.name, definition.result, definition.arguments);

    const result = func(...args);

    if (definition.result === 'int') {
      logger.info(`Function ${definition.name} returned code ${result}`);
    } else {
      return result;
    }
  }

  protected getPointer(): BigUint64Array {
    return new BigUint64Array([0n]);
  }

  protected getPointerValue(pointer: BigUint64Array): bigint | undefined {
    return pointer[0];
  }

  private getSharedLibrary(): koffi.IKoffiLib {
    if (!this.library) {
      logger.info('Loading shared library', {
        filepath: this.libraryFilepath,
      });

      this.library = koffi.load(this.libraryFilepath, {
        global: true,
      });
    }

    return this.library;
  }
}