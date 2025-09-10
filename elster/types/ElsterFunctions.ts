import * as koffi from 'koffi';
import { pointer } from 'koffi';
import type { ElsterDruckParameter } from './ElsterDruckParameter';
import type { ElsterVerschluesselungsParameter } from './ElsterVerschluesselungsParameter';
import { SharedLibraryFunction } from '../SharedLibraryFunction';

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
const EricLogCallback = koffi.proto('LogCallback', 'void', [
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

export default {
  EricInitialisiere: new SharedLibraryFunction('EricInitialisiere', [
    'str', // pluginPfad
    'str', // logPfad
  ]),

  EricBeende: new SharedLibraryFunction('EricBeende'),

  EricHoleFehlerText: new SharedLibraryFunction('EricHoleFehlerText', [
    'int', // fehlerkode
    EricRueckgabepufferHandle,
  ]),

  EricEinstellungSetzen: new SharedLibraryFunction('EricEinstellungSetzen', [
    'str', // name
    'str', // wert
  ]),

  EricEinstellungLesen: new SharedLibraryFunction('EricEinstellungLesen', [
    'str', // name
    EricRueckgabepufferHandle,
  ]),

  EricGetHandleToCertificate: new SharedLibraryFunction('EricGetHandleToCertificate', [
    pointer(EricZertifikatHandle),
    pointer('uint32_t'),
    'str',
  ]),

  EricCloseHandleToCertificate: new SharedLibraryFunction('EricCloseHandleToCertificate', [
    EricZertifikatHandle,
  ]),

  EricRueckgabepufferErzeugen: new SharedLibraryFunction(
    'EricRueckgabepufferErzeugen',
    [],
    EricRueckgabepufferHandle,
  ),

  EricRueckgabepufferInhalt: new SharedLibraryFunction(
    'EricRueckgabepufferInhalt',
    [EricRueckgabepufferHandle],
    'str',
  ),

  EricRueckgabepufferFreigeben: new SharedLibraryFunction('EricRueckgabepufferFreigeben', [
    EricRueckgabepufferHandle,
  ]),

  EricRegistriereLogCallback: new SharedLibraryFunction(
    'EricRegistriereLogCallback',
    [
      koffi.pointer(EricLogCallback), // funktion
      'uint32_t', // schreibeEricLogDatei
      koffi.pointer('void'), // benutzerdaten
    ],
    'int',
  ),

  EricCreateTH: new SharedLibraryFunction('EricCreateTH', [
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
  ]),

  EricBearbeiteVorgang: new SharedLibraryFunction('EricBearbeiteVorgang', [
    'str', // datenpuffer
    'str', // datenartVersion
    'uint32_t', // bearbeitungsFlags
    pointer(eric_druck_parameter_t), // druckParameter
    pointer(eric_verschluesselungs_parameter_t), // cryptoParameter
    pointer(EricTransferHandle), // transferHandle
    EricRueckgabepufferHandle, // rueckgabeXmlPuffer
    EricRueckgabepufferHandle, // serverantwortXmlPuffer
  ]),
}
