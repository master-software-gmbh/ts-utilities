import * as koffi from 'koffi';
import { SharedLibraryFunction } from './SharedLibraryFunction';

const OttoInstanz = koffi.opaque('OttoInstanz');
const OttoInstanzHandle = koffi.pointer(OttoInstanz);

const OttoRueckgabepuffer = koffi.opaque('OttoRueckgabepuffer');
const OttoRueckgabepufferHandle = koffi.pointer(OttoRueckgabepuffer);

export default {
  OttoInstanzErzeugen: new SharedLibraryFunction('OttoInstanzErzeugen', [
    'str',
    koffi.pointer('void'),
    koffi.pointer('void'),
    koffi.out(OttoInstanzHandle),
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

  OttoRueckgabepufferErzeugen: new SharedLibraryFunction('OttoRueckgabepufferErzeugen', [
    OttoInstanzHandle, // instanz
    koffi.out(OttoRueckgabepufferHandle), // rueckgabepuffer
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
}
