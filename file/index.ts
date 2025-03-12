import { loadModule } from '../esm';

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
export async function createZipFile(sourceFiles: { filename: string; content: string }[]): Promise<Uint8Array> {
  const JSZip = await loadModule<typeof import('jszip')>('jszip');
  const zipFile = new JSZip();

  for (const file of sourceFiles) {
    zipFile.file(file.filename, file.content);
  }

  return zipFile.generateAsync({
    type: 'uint8array',
  });
}
