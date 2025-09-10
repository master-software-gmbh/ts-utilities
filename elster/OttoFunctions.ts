import * as koffi from 'koffi';
import { SharedLibraryFunction } from './SharedLibraryFunction';

const OttoInstanz = koffi.opaque('OttoInstanz');
const OttoInstanzHandle = koffi.pointer(OttoInstanz);

const OttoZertifikat = koffi.opaque('OttoZertifikat');
const OttoZertifikatHandle = koffi.pointer(OttoZertifikat);

const OttoEmpfang = koffi.opaque('OttoEmpfang');
const OttoEmpfangHandle = koffi.pointer(OttoEmpfang);

const OttoRueckgabepuffer = koffi.opaque('OttoRueckgabepuffer');
const OttoRueckgabepufferHandle = koffi.pointer(OttoRueckgabepuffer);

export default {
  OttoInstanzErzeugen: new SharedLibraryFunction('OttoInstanzErzeugen', [
    'str',
    koffi.pointer('void'),
    koffi.pointer('void'),
    koffi.out(koffi.pointer(OttoInstanzHandle)),
  ]),

  OttoInstanzFreigeben: new SharedLibraryFunction('OttoInstanzFreigeben', [
    OttoInstanzHandle,
  ]),

  OttoDatenAbholen: new SharedLibraryFunction('OttoDatenAbholen', [
    OttoInstanzHandle, // instanz
    'str', // objektId
    'uint32_t', // objektGroesse
    'str', // zertifikatsPfad
    'str', // zertifikatsPasswort
    'str', // herstellerId
    'str', // abholzertifikat
    OttoRueckgabepufferHandle, // abholDaten
  ]),

  OttoZertifikatOeffnen: new SharedLibraryFunction('OttoZertifikatOeffnen', [
    OttoInstanzHandle, // instanz
    'str', // zertifikatsPfad
    'str', // zertifikatsPasswort
    koffi.out(koffi.pointer(OttoZertifikatHandle)), // zertifikat
  ]),

  OttoZertifikatSchliessen: new SharedLibraryFunction('OttoZertifikatSchliessen', [
    OttoZertifikatHandle,
  ]),

  OttoRueckgabepufferErzeugen: new SharedLibraryFunction('OttoRueckgabepufferErzeugen', [
    OttoInstanzHandle, // instanz
    koffi.out(koffi.pointer(OttoRueckgabepufferHandle)), // rueckgabepuffer
  ]),

  OttoRueckgabepufferInhalt: new SharedLibraryFunction('OttoRueckgabepufferInhalt', [
    OttoRueckgabepufferHandle, // rueckgabepuffer
  ], koffi.pointer('void')),

  OttoRueckgabepufferGroesse: new SharedLibraryFunction('OttoRueckgabepufferGroesse', [
    OttoRueckgabepufferHandle, // rueckgabepuffer
  ], 'uint64_t'),

  OttoRueckgabepufferFreigeben: new SharedLibraryFunction('OttoRueckgabepufferFreigeben', [
    OttoRueckgabepufferHandle, // rueckgabepuffer
  ]),

  OttoEmpfangBeginnen: new SharedLibraryFunction('OttoEmpfangBeginnen', [
    OttoInstanzHandle, // instanz
    'str', // objektId
    OttoZertifikatHandle, // zertifikat
    'str', // herstellerId
    koffi.out(koffi.pointer(OttoEmpfangHandle)), // empfang
  ]),

  OttoEmpfangFortsetzen: new SharedLibraryFunction('OttoEmpfangFortsetzen', [
    OttoEmpfangHandle, // empfang
    OttoRueckgabepufferHandle, // datenBlock
  ]),

  OttoEmpfangBeenden: new SharedLibraryFunction('OttoEmpfangBeenden', [
    OttoEmpfangHandle, // empfang
  ]),
}
