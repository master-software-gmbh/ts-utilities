import OttoFunctions from './OttoFunctions';
import { SharedLibrary } from './SharedLibrary';

export class OttoClient extends SharedLibrary {
  instanzErzeugen(config: { logsDirectory: string }): bigint | undefined {
    const instanz = this.getPointer();

    this.callFunction(OttoFunctions.OttoInstanzErzeugen, [config.logsDirectory, null, null, instanz]);

    return this.getPointerValue(instanz);
  }

  instanzFreigeben(instanz: bigint) {
    this.callFunction(OttoFunctions.OttoInstanzFreigeben, [instanz]);
  }

  rueckgabepufferErzeugen(instanz: bigint): bigint | undefined {
    const handle = this.getPointer();

    this.callFunction(OttoFunctions.OttoRueckgabepufferErzeugen, [
      instanz,
      handle,
    ]);

    return this.getPointerValue(handle);
  }

  rueckgabepufferInhalt(rueckgabepuffer: bigint): unknown {
    return this.callFunction(OttoFunctions.OttoRueckgabepufferInhalt, [
      rueckgabepuffer,
    ]);
  }

  rueckgabepufferGroesse(rueckgabepuffer: bigint): number {
    return this.callFunction(OttoFunctions.OttoRueckgabepufferGroesse, [
      rueckgabepuffer,
    ]);
  }

  rueckgabepufferFreigeben(rueckgabepuffer: bigint) {
    this.callFunction(OttoFunctions.OttoRueckgabepufferFreigeben, [
      rueckgabepuffer,
    ]);
  }

  /**
   * Holt das Datenobjekt zu einer Objekt-ID von OTTER mit einem einzigen Funktionsaufruf vollständig ab.
   * 
   * Diese Funktion ist eine bequemere Alternative zu der blockweisen Datenabholung über die OttoEmpfang-Funktionen. Intern bündelt sie die Aufrufe der OttoEmpfangs-Funktionen, wie sie sonst von der Anwendung selbst durchgeführt werden müßten.
   * 
   * Der Nachteil dieser Funktion gegenüber den OttoEmpfang-Funktionen besteht darin, dass die abgeholten Daten alle im Hauptspeicher von Otto gehalten werden. Sie eignet sich daher nicht für die Abholung sehr großer Datenobjekte oder wenn nur sehr wenig Hauptspeicher zur Verfügung steht.
   * 
   * @param groesse Die erwartete Größe des Datenobjekts, das vom OTTER-Server abgeholt werden soll, in Bytes. Diesen Wert findet die Anwendung zusammen mit der Objekt-ID im Rückgabe-XML zu einer PostfachAnfrage. Wenn die Größe zu gering angegeben wird, geht dies zwar zu Lasten der Geschwindigkeit und des Hauptspeicherbedarfs, weil dann der Rückgabepuffer von Otto intern sukzessive vergrößert werden muß, aber es führt nicht zu einem Fehler.
   */
  datenAbholen(instanz: bigint, objektId: string, groesse: number, zertifikatPfad: string, zertifikatPasswort: string, herstellerId: string, rueckgabepuffer: bigint) {
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
}
