import * as koffi from 'koffi';
import type { ElsterDruckParameter } from './types/ElsterDruckParameter';
import { ElsterEinstellung } from './types/ElsterEinstellung';
import ElsterFunctions from './types/ElsterFunctions';
import type { ElsterLogsConfig } from './types/ElsterLogsConfig';
import type { ElsterTransferHeaderConfig } from './types/ElsterTransferHeaderConfig';
import type { ElsterVorgangConfig } from './types/ElsterVorgangConfig';
import type { ElsterVorgangErgebnis } from './types/ElsterVorgangErgebnis';
import { SharedLibrary } from './SharedLibrary';

export class ElsterRichClient extends SharedLibrary {
  initialisiere(config: ElsterLogsConfig): void {
    this.callFunction(ElsterFunctions.EricInitialisiere, [null, config.logsDirectory]);

    if (config.detailedLog) {
      this.einstellungSetzen(ElsterEinstellung.detailedLog, 'ja');
    }
  }

  beende(): void {
    this.callFunction(ElsterFunctions.EricBeende);
  }

  holeFehlerText(errorCode: number): string {
    const handle = this.rueckgabepufferErzeugen();
    this.callFunction(ElsterFunctions.EricHoleFehlerText, [errorCode, handle]);

    const text = this.rueckgabepufferInhalt(handle);
    this.rueckgabepufferFreigeben(handle);

    return text;
  }

  einstellungSetzen(name: string, value: string): void {
    this.callFunction(ElsterFunctions.EricEinstellungSetzen, [name, value]);
  }

  einstellungLesen(name: string): string {
    const handle = this.rueckgabepufferErzeugen();
    this.callFunction(ElsterFunctions.EricEinstellungLesen, [name, handle]);

    const value = this.rueckgabepufferInhalt(handle);
    this.rueckgabepufferFreigeben(handle);

    return value;
  }

  getTransferHandle(): Uint32Array {
    return this.getPointer();
  }

  getHandleToCertificate(path: string): number | undefined {
    const handle = this.getPointer();
    const pinInfo = this.getPointer();

    this.callFunction(ElsterFunctions.EricGetHandleToCertificate, [handle, pinInfo, path]);

    return this.getPointerValue(handle);
  }

  closeHandleToCertificate(handle: number) {
    this.callFunction(ElsterFunctions.EricCloseHandleToCertificate, [handle]);
  }

  rueckgabepufferErzeugen(): object {
    return this.callFunction(ElsterFunctions.EricRueckgabepufferErzeugen);
  }

  rueckgabepufferInhalt(handle: object): string {
    return this.callFunction(ElsterFunctions.EricRueckgabepufferInhalt, [handle]);
  }

  rueckgabepufferFreigeben(handle: object): void {
    this.callFunction(ElsterFunctions.EricRueckgabepufferFreigeben, [handle]);
  }

  createTransferHeader(xml: string, config: ElsterTransferHeaderConfig): string {
    const xmlRueckgabePuffer = this.rueckgabepufferErzeugen();

    this.callFunction(ElsterFunctions.EricCreateTH, [
      xml,
      config.verfahren,
      config.datenart,
      config.vorgangsart,
      config.testmerker,
      config.herstellerId,
      config.datenlieferant,
      config.versionClient,
      null,
      xmlRueckgabePuffer,
    ]);

    const buffer = this.rueckgabepufferInhalt(xmlRueckgabePuffer);
    this.rueckgabepufferFreigeben(xmlRueckgabePuffer);

    return buffer;
  }

  async bearbeiteVorgang(xml: string, config: ElsterVorgangConfig): Promise<ElsterVorgangErgebnis> {
    let pdfBuffer: Buffer | null = null;

    const rueckgabeXmlBuffer = this.rueckgabepufferErzeugen();
    const serverantwortXmlBuffer = this.rueckgabepufferErzeugen();

    const druckParameter = this.getDruckParameter((data) => {
      pdfBuffer = data;
    });

    this.callFunction(ElsterFunctions.EricBearbeiteVorgang, [
      xml,
      config.datenartVersion,
      config.bearbeitungsFlag,
      druckParameter,
      config.verschluesselung,
      config.transferHandle,
      rueckgabeXmlBuffer,
      serverantwortXmlBuffer,
    ]);

    const rueckgabeXml = this.rueckgabepufferInhalt(rueckgabeXmlBuffer);
    this.rueckgabepufferFreigeben(rueckgabeXmlBuffer);

    const serverantwortXml = this.rueckgabepufferInhalt(serverantwortXmlBuffer);
    this.rueckgabepufferFreigeben(serverantwortXmlBuffer);

    return { xml, rueckgabeXml, serverantwortXml, pdf: pdfBuffer };
  }

  getDruckParameter(callback: (data: Buffer) => void): ElsterDruckParameter {
    return {
      version: 4,
      vorschau: 0,
      pdfName: null,
      duplexDruck: 0,
      fussText: null,
      pdfCallbackBenutzerdaten: null,
      pdfCallback: (_name, data, size) => {
        const decodedData = koffi.decode(data, koffi.array('uint8_t', size));
        callback(Buffer.from(decodedData));
        return 0;
      },
    };
  }
}
