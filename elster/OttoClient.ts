import OttoFunctions from './OttoFunctions';
import { SharedLibrary } from './SharedLibrary';

export class OttoClient extends SharedLibrary {
  instanzErzeugen(config: { logsDirectory: string }): number | undefined {
    const instanz = this.getPointer();

    this.callFunction(OttoFunctions.OttoInstanzErzeugen, [config.logsDirectory, null, null, instanz]);

    return this.getPointerValue(instanz);
  }

  instanzFreigeben(instanz: number) {
    this.callFunction(OttoFunctions.OttoInstanzFreigeben, [instanz]);
  }

  zertifikatOeffnen(instanz: number, pfad: string, passwort: string): number | undefined {
    const handle = this.getPointer();

    this.callFunction(OttoFunctions.OttoZertifikatOeffnen, [
      instanz,
      pfad,
      passwort,
      handle,
    ]);

    return this.getPointerValue(handle);
  }

  zertifikatSchliessen(zertifikat: number) {
    this.callFunction(OttoFunctions.OttoZertifikatSchliessen, [zertifikat]);
  }

  rueckgabepufferErzeugen(instanz: number): number | undefined {
    const handle = this.getPointer();

    this.callFunction(OttoFunctions.OttoRueckgabepufferErzeugen, [
      instanz,
      handle,
    ]);

    return this.getPointerValue(handle);
  }

  rueckgabepufferInhalt(rueckgabepuffer: number): string {
    return this.callFunction(OttoFunctions.OttoRueckgabepufferInhalt, [
      rueckgabepuffer,
    ]);
  }

  rueckgabepufferGroesse(rueckgabepuffer: number): number {
    return this.callFunction(OttoFunctions.OttoRueckgabepufferGroesse, [
      rueckgabepuffer,
    ]);
  }

  rueckgabepufferFreigeben(rueckgabepuffer: number) {
    this.callFunction(OttoFunctions.OttoRueckgabepufferFreigeben, [
      rueckgabepuffer,
    ]);
  }

  datenAbholen(instanz: number, objektId: string, groesse: number, zertifikatPfad: string, zertifikatPasswort: string, herstellerId: string, rueckgabepuffer: number) {
    this.callFunction(OttoFunctions.OttoDatenAbholen, [
      instanz,
      objektId,
      groesse,
      zertifikatPfad,
      zertifikatPasswort,
      herstellerId,
      null,
      rueckgabepuffer,
    ]);
  }

  empfangBeginnen(instanz: number, objektId: string, zertifikat: number, herstellerId: string) {
    const handle = this.getPointer();

    this.callFunction(OttoFunctions.OttoEmpfangBeginnen, [
      instanz,
      objektId,
      zertifikat,
      herstellerId,
      handle,
    ]);

    return this.getPointerValue(handle);
  }

  empfangFortsetzen(empfang: number, rueckgabepuffer: number) {
    this.callFunction(OttoFunctions.OttoEmpfangFortsetzen, [
      empfang,
      rueckgabepuffer,
    ]);
  }

  empfangBeenden(empfang: number) {
    this.callFunction(OttoFunctions.OttoEmpfangBeenden, [
      empfang,
    ]);
  }
}
