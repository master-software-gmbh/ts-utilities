export const C = {
  kbToBytes: (kb: number) => kb * 1024,
  mbToBytes: (mb: number) => mb * 1024 * 1024,
  gbToBytes: (gb: number) => gb * 1024 * 1024 * 1024,
};

export const MimeType = {
  applicationOctetStream: 'application/octet-stream',
  applicationPdf: 'application/pdf',

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

export const FileExtension = {
  avif: 'avif',
  css: 'css',
  gif: 'gif',
  html: 'html',
  jpeg: 'jpeg',
  jpg: 'jpg',
  js: 'js',
  log: 'log',
  md: 'md',
  pdf: 'pdf',
  png: 'png',
  svg: 'svg',
  tiff: 'tiff',
  txt: 'txt',
  webp: 'webp',
} as const;

export type FileExtension = (typeof FileExtension)[keyof typeof FileExtension];

export const MimeTypeToFileExtension: {
  [type: string]: FileExtension[];
} = {
  [MimeType.applicationPdf]: [FileExtension.pdf],
  [MimeType.imageAvif]: [FileExtension.avif],
  [MimeType.imageGif]: [FileExtension.gif],
  [MimeType.imageJpeg]: [FileExtension.jpg, FileExtension.jpeg],
  [MimeType.imagePng]: [FileExtension.png],
  [MimeType.imageSvg]: [FileExtension.svg],
  [MimeType.imageTiff]: [FileExtension.tiff],
  [MimeType.imageWebp]: [FileExtension.webp],
  [MimeType.textCss]: [FileExtension.css],
  [MimeType.textHtml]: [FileExtension.html],
  [MimeType.textJavascript]: [FileExtension.js],
  [MimeType.textPlain]: [FileExtension.txt, FileExtension.log, FileExtension.md],
};
