import * as koffi from 'koffi';
import { type TypeSpec, pointer } from 'koffi';
import type { ElsterDruckParameter } from './ElsterDruckParameter';
import type { ElsterVerschluesselungsParameter } from './ElsterVerschluesselungsParameter';

const EricZertifikatHandleType = 'uint32_t';
const EricTransferHandle = 'uint32_t';
const EricReturnBufferApi = koffi.opaque('EricReturnBufferApi');
const EricRueckgabepufferHandle = koffi.pointer('EricRueckgabepufferHandle', EricReturnBufferApi);
const EricPdfCallbackBenutzerdaten = koffi.pointer('void');
const EricPdfCallback = koffi.proto('PdfCallback', 'int', [
  'str',
  koffi.pointer('uint8_t'),
  'uint32_t',
  EricPdfCallbackBenutzerdaten,
]);

const eric_druck_parameter_t = koffi.struct('eric_druck_parameter_t', {
  version: 'uint32_t',
  vorschau: 'uint32_t',
  duplexDruck: 'uint32_t',
  pdfName: 'str',
  fussText: 'str',
  pdfCallback: koffi.pointer(EricPdfCallback),
  pdfCallbackBenutzerdaten: EricPdfCallbackBenutzerdaten,
} satisfies Record<keyof ElsterDruckParameter, string | koffi.IKoffiCType>);

const eric_verschluesselungs_parameter_t = koffi.struct('eric_verschluesselungs_parameter_t', {
  version: 'uint32_t',
  zertifikatHandle: EricZertifikatHandleType,
  pin: 'str',
} satisfies Record<keyof ElsterVerschluesselungsParameter, string>);

export class ElsterFunctionDefinition {
  name: string;
  result: TypeSpec;
  arguments: TypeSpec[];

  constructor(name: string, args?: TypeSpec[], result?: TypeSpec) {
    this.name = name;
    this.arguments = args ?? [];
    this.result = result ?? 'int';
  }

  static readonly EricInitialisiere = new ElsterFunctionDefinition('EricInitialisiere', [
    'str', // pluginPfad
    'str', // logPfad
  ]);

  static readonly EricBeende = new ElsterFunctionDefinition('EricBeende');

  static readonly EricHoleFehlerText = new ElsterFunctionDefinition('EricHoleFehlerText', [
    'int', // fehlerkode
    EricRueckgabepufferHandle,
  ]);

  static readonly EricEinstellungSetzen = new ElsterFunctionDefinition('EricEinstellungSetzen', [
    'str', // name
    'str', // wert
  ]);

  static readonly EricEinstellungLesen = new ElsterFunctionDefinition('EricEinstellungLesen', [
    'str', // name
    EricRueckgabepufferHandle,
  ]);

  static readonly EricGetHandleToCertificate = new ElsterFunctionDefinition('EricGetHandleToCertificate', [
    pointer(EricZertifikatHandleType),
    pointer('uint32_t'),
    'str',
  ]);

  static readonly EricCloseHandleToCertificate = new ElsterFunctionDefinition('EricCloseHandleToCertificate', [
    EricZertifikatHandleType,
  ]);

  static readonly EricRueckgabepufferErzeugen = new ElsterFunctionDefinition(
    'EricRueckgabepufferErzeugen',
    [],
    EricRueckgabepufferHandle,
  );

  static readonly EricRueckgabepufferInhalt = new ElsterFunctionDefinition(
    'EricRueckgabepufferInhalt',
    [EricRueckgabepufferHandle],
    'str',
  );

  static readonly EricRueckgabepufferFreigeben = new ElsterFunctionDefinition('EricRueckgabepufferFreigeben', [
    EricRueckgabepufferHandle,
  ]);

  static readonly EricCreateTH = new ElsterFunctionDefinition('EricCreateTH', [
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

  static readonly EricBearbeiteVorgang = new ElsterFunctionDefinition('EricBearbeiteVorgang', [
    'str', // datenpuffer
    'str', // datenartVersion
    'uint32_t', // bearbeitungsFlags
    pointer(eric_druck_parameter_t),
    pointer(eric_verschluesselungs_parameter_t),
    pointer(EricTransferHandle),
    EricRueckgabepufferHandle, // rueckgabeXmlPuffer
    EricRueckgabepufferHandle, // serverantwortXmlPuffer
  ]);
}
