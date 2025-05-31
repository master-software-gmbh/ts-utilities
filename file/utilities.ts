import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { loadModule } from '../esm';
import { logger } from '../logging';
import { type Result, error, success } from '../result';

export const C = {
  kbToBytes: (kb: number) => kb * 1024,
  mbToBytes: (mb: number) => mb * 1024 * 1024,
  gbToBytes: (gb: number) => gb * 1024 * 1024 * 1024,
};

export const MimeType = {
  applicationOctetStream: 'application/octet-stream',
  applicationPdf: 'application/pdf',

  audioAac: 'audio/aac',
  audioMpeg: 'audio/mpeg',
  audioOgg: 'audio/ogg',
  audioWav: 'audio/wav',
  audioWebm: 'audio/webm',

  imageAvif: 'image/avif',
  imageGif: 'image/gif',
  imageJpeg: 'image/jpeg',
  imagePng: 'image/png',
  imageSvg: 'image/svg+xml',
  imageTiff: 'image/tiff',
  imageWebp: 'image/webp',

  textCss: 'text/css',
  textHtml: 'text/html',
  textJavascript: 'text/javascript',
  textPlain: 'text/plain',
} as const;

export type MimeType = (typeof MimeType)[keyof typeof MimeType];

export const MimeTypeToFileExtension: {
  [type: string]: string[];
} = {
  [MimeType.applicationPdf]: ['pdf'],
  [MimeType.audioAac]: ['aac'],
  [MimeType.audioMpeg]: ['mp3'],
  [MimeType.audioOgg]: ['ogg'],
  [MimeType.audioWav]: ['wav'],
  [MimeType.audioWebm]: ['webm'],
  [MimeType.imageAvif]: ['avif'],
  [MimeType.imageGif]: ['gif'],
  [MimeType.imageJpeg]: ['jpeg', 'jpg'],
  [MimeType.imagePng]: ['png'],
  [MimeType.imageSvg]: ['svg'],
  [MimeType.imageTiff]: ['tiff'],
  [MimeType.imageWebp]: ['webp'],
  [MimeType.textCss]: ['css'],
  [MimeType.textHtml]: ['html'],
  [MimeType.textJavascript]: ['js'],
  [MimeType.textPlain]: ['txt', 'log', 'md'],
};

/**
 * Creates a zip file from the given source files.
 * @param sourceFiles list of files to include in the archive
 * @returns zip file as a Uint8Array
 */
export async function createZipFile(
  sourceFiles: { filename: string; content: string }[],
): Promise<Result<Uint8Array, 'missing_dependency'>> {
  // @ts-ignore optional dependency
  const { data: JSZip } = await loadModule<typeof import('jszip')>('jszip');

  if (!JSZip) {
    return error('missing_dependency');
  }

  const zipFileHandle = new JSZip();

  for (const file of sourceFiles) {
    zipFileHandle.file(file.filename, file.content);
  }

  const zipFile = await zipFileHandle.generateAsync({
    type: 'uint8array',
  });

  return success(zipFile);
}

/**
 * Extracts the contents of a zip file to the destination path.
 * @param path path to the zip file to be extracted.
 * @param destination path to the destination directory where the files will be extracted.
 */
export async function extractZipFile(path: string, destination: string): Promise<Result<void, 'missing_dependency'>> {
  // @ts-ignore optional dependency
  const { data: JSZip } = await loadModule<typeof import('jszip')>('jszip');

  if (!JSZip) {
    return error('missing_dependency');
  }

  const content = await readFile(path);
  const zip = await JSZip.loadAsync(content);

  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }

  for (const [relativePath, file] of Object.entries(zip.files)) {
    const fullPath = join(destination, relativePath);

    if (file.dir) {
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
    } else {
      const fileContent = await file.async('nodebuffer');
      await writeFile(fullPath, fileContent);
    }
  }

  return success();
}

export async function typedJsonFile<T, S extends StandardSchemaV1<unknown, T>>(
  filepath: string,
  schema: S,
): Promise<Result<StandardSchemaV1.InferOutput<S>, 'reading_failed' | 'decoding_failed' | 'validation_failed'>> {
  let stringData: string;

  try {
    stringData = await readFile(filepath, 'utf-8');
  } catch (e) {
    logger.error('Failed to read data file', { filepath, error: e });
    return error('reading_failed');
  }

  let jsonData: unknown;

  try {
    jsonData = JSON.parse(stringData);
  } catch (e) {
    logger.error('Failed to decode data file', { filepath, error: e });
    return error('decoding_failed');
  }

  const data = await schema['~standard'].validate(jsonData);

  if (data.issues) {
    logger.error('Failed to validate data file', { filepath, issues: data.issues });
    return error('validation_failed');
  }

  return success(data.value);
}
