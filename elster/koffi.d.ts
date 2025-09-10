import * as koffi from 'koffi';

declare module 'koffi' {
  export function load(path: string, options?: { lazy?: boolean; global?: boolean }): IKoffiLib;
}
