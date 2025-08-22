import * as koffi from 'koffi';
import { type TypeSpec, pointer } from 'koffi';
import type { ElsterDruckParameter } from './ElsterDruckParameter';
import type { ElsterVerschluesselungsParameter } from './ElsterVerschluesselungsParameter';

const EricZertifikatHandle = 'uint32_t';
const EricTransferHandle = 'uint32_t';
const EricReturnBufferApi = koffi.opaque('EricReturnBufferApi');
const EricRueckgabepufferHandle = koffi.pointer('EricRueckgabepufferHandle', EricReturnBufferApi);

const EricPdfCallback = koffi.proto('PdfCallback', 'int', [
  'str', // pdfBezeichner
  koffi.pointer('uint8_t'), // pdfDaten
  'uint32_t', // pdfGroesse
  koffi.pointer('void'), // benutzerDaten
]);

// typedef void(* EricLogCallback) (const char *kategorie, eric_log_level_t loglevel, const char *nachricht, void *benutzerdaten)
export const EricLogCallback = koffi.proto('LogCallback', 'void', [
  'str', // kategorie
  'int', // loglevel
  'str', // nachricht
  koffi.pointer('void'), // benutzerdaten
]);

// Order is important
const eric_druck_parameter_t = koffi.struct('eric_druck_parameter_t', {
  version: 'uint32_t',
  vorschau: 'uint32_t',
  duplexDruck: 'uint32_t',
  pdfName: 'str',
  fussText: 'str',
  pdfCallback: koffi.pointer(EricPdfCallback),
  pdfCallbackBenutzerdaten: koffi.pointer('void'),
} satisfies Record<keyof ElsterDruckParameter, string | koffi.IKoffiCType>);

// Order is important
const eric_verschluesselungs_parameter_t = koffi.struct('eric_verschluesselungs_parameter_t', {
  version: 'uint32_t',
  zertifikatHandle: EricZertifikatHandle,
  pin: 'str',
} satisfies Record<keyof ElsterVerschluesselungsParameter, string>);

export class ElsterFunktion {
  name: string;
  result: TypeSpec;
  arguments: TypeSpec[];

  constructor(name: string, args?: TypeSpec[], result?: TypeSpec) {
    this.name = name;
    this.arguments = args ?? [];
    this.result = result ?? 'int';
  }

  static readonly EricInitialisiere = new ElsterFunktion('EricInitialisiere', [
    'str', // pluginPfad
    'str', // logPfad
  ]);

  static readonly EricBeende = new ElsterFunktion('EricBeende');

  static readonly EricHoleFehlerText = new ElsterFunktion('EricHoleFehlerText', [
    'int', // fehlerkode
    EricRueckgabepufferHandle,
  ]);

  static readonly EricEinstellungSetzen = new ElsterFunktion('EricEinstellungSetzen', [
    'str', // name
    'str', // wert
  ]);

  static readonly EricEinstellungLesen = new ElsterFunktion('EricEinstellungLesen', [
    'str', // name
    EricRueckgabepufferHandle,
  ]);

  static readonly EricGetHandleToCertificate = new ElsterFunktion('EricGetHandleToCertificate', [
    pointer(EricZertifikatHandle),
    pointer('uint32_t'),
    'str',
  ]);

  static readonly EricCloseHandleToCertificate = new ElsterFunktion('EricCloseHandleToCertificate', [
    EricZertifikatHandle,
  ]);

  static readonly EricRueckgabepufferErzeugen = new ElsterFunktion(
    'EricRueckgabepufferErzeugen',
    [],
    EricRueckgabepufferHandle,
  );

  static readonly EricRueckgabepufferInhalt = new ElsterFunktion(
    'EricRueckgabepufferInhalt',
    [EricRueckgabepufferHandle],
    'str',
  );

  static readonly EricRueckgabepufferFreigeben = new ElsterFunktion('EricRueckgabepufferFreigeben', [
    EricRueckgabepufferHandle,
  ]);

  static readonly EricRegistriereLogCallback = new ElsterFunktion(
    'EricRegistriereLogCallback',
    [
      koffi.pointer(EricLogCallback), // funktion
      'uint32_t', // schreibeEricLogDatei
      koffi.pointer('void'), // benutzerdaten
    ],
    'int',
  );

  static readonly EricCreateTH = new ElsterFunktion('EricCreateTH', [
    'str', // xml
    'str', // verfahren
    'str', // datenart
    'str', // vorgang
    'str', // testmerker
    'str', // herstellerId
    'str', // datenLieferant
    'str', // versionClient
    'str', // publicKey
    EricRueckgabepufferHandle,
  ]);

  static readonly EricBearbeiteVorgang = new ElsterFunktion('EricBearbeiteVorgang', [
    'str', // datenpuffer
    'str', // datenartVersion
    'uint32_t', // bearbeitungsFlags
    pointer(eric_druck_parameter_t), // druckParameter
    pointer(eric_verschluesselungs_parameter_t), // cryptoParameter
    pointer(EricTransferHandle), // transferHandle
    EricRueckgabepufferHandle, // rueckgabeXmlPuffer
    EricRueckgabepufferHandle, // serverantwortXmlPuffer
  ]);
}
