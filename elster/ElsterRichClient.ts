import * as koffi from 'koffi';
import { logger } from '../logging';
import type { ElsterConfig } from './types/ElsterConfig';
import type { ElsterDruckParameter } from './types/ElsterDruckParameter';
import { ElsterEinstellung } from './types/ElsterEinstellung';
import { ElsterFunktion } from './types/ElsterFunktionen';
import type { ElsterTransferHeaderConfig } from './types/ElsterTransferHeaderConfig';
import type { ElsterVorgangConfig } from './types/ElsterVorgangConfig';
import type { ElsterVorgangErgebnis } from './types/ElsterVorgangErgebnis';
import type { ElsterLogCallback } from './types/ElsterLogCallback';

declare module 'koffi' {
  export function load(path: string, options?: { lazy?: boolean; global?: boolean }): IKoffiLib;
}

export class ElsterRichClient {
  private ericLibrary?: koffi.IKoffiLib;
  private readonly config: ElsterConfig;

  constructor(config: ElsterConfig) {
    this.config = config;
  }

  initialisiere(detailedLog?: boolean): void {
    this.callFunction(ElsterFunktion.EricInitialisiere, [null, this.config.logsDirectory]);

    if (detailedLog) {
      this.einstellungSetzen(ElsterEinstellung.detailedLog, 'ja');
    }
  }

  beende(): void {
    this.callFunction(ElsterFunktion.EricBeende);
  }

  holeFehlerText(errorCode: number): string {
    const handle = this.rueckgabepufferErzeugen();
    this.callFunction(ElsterFunktion.EricHoleFehlerText, [errorCode, handle]);

    const text = this.rueckgabepufferInhalt(handle);
    this.rueckgabepufferFreigeben(handle);

    return text;
  }

  einstellungSetzen(name: string, value: string): void {
    this.callFunction(ElsterFunktion.EricEinstellungSetzen, [name, value]);
  }

  einstellungLesen(name: string): string {
    const handle = this.rueckgabepufferErzeugen();
    this.callFunction(ElsterFunktion.EricEinstellungLesen, [name, handle]);

    const value = this.rueckgabepufferInhalt(handle);
    this.rueckgabepufferFreigeben(handle);

    return value;
  }

  getHandleToCertificate(path: string): number | undefined {
    const handle = this.getIntPointer();
    const pinInfo = this.getIntPointer();

    this.callFunction(ElsterFunktion.EricGetHandleToCertificate, [handle, pinInfo, path]);

    return this.getIntPointerValue(handle);
  }

  closeHandleToCertificate(handle: number) {
    this.callFunction(ElsterFunktion.EricCloseHandleToCertificate, [handle]);
  }

  rueckgabepufferErzeugen(): object {
    return this.callFunction(ElsterFunktion.EricRueckgabepufferErzeugen);
  }

  rueckgabepufferInhalt(handle: object): string {
    return this.callFunction(ElsterFunktion.EricRueckgabepufferInhalt, [handle]);
  }

  rueckgabepufferFreigeben(handle: object): void {
    this.callFunction(ElsterFunktion.EricRueckgabepufferFreigeben, [handle]);
  }

  registriereLogCallback(funktion: ElsterLogCallback, writeLogFile: boolean): void {
    this.callFunction(ElsterFunktion.EricRegistriereLogCallback, [funktion, writeLogFile ? 1 : 0]);
  }

  createTransferHeader(xml: string, config: ElsterTransferHeaderConfig): string {
    const xmlRueckgabePuffer = this.rueckgabepufferErzeugen();

    this.callFunction(ElsterFunktion.EricCreateTH, [
      xml,
      config.verfahren,
      config.datenart,
      config.uebertragungsart,
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

    this.callFunction(ElsterFunktion.EricBearbeiteVorgang, [
      xml,
      config.datenartVersion,
      config.bearbeitungsFlag,
      druckParameter,
      config.verschluesselung,
      null,
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
      pdfCallbackBenutzerdaten: null,
      fussText: this.config.printFusstext ?? null,
      pdfCallback: (_name, data, size) => {
        const decodedData = koffi.decode(data, koffi.array('uint8_t', size));
        callback(Buffer.from(decodedData));
        return 0;
      },
    };
  }

  private getEricLibrary(): koffi.IKoffiLib {
    if (!this.ericLibrary) {
      logger.info('Loading shared ERiC library');

      this.ericLibrary = koffi.load(this.config.libraryFilepath, {
        global: true,
      });
    }

    return this.ericLibrary;
  }

  private getIntPointer(): Uint32Array {
    return new Uint32Array([0]);
  }

  private getIntPointerValue(pointer: Uint32Array): number | undefined {
    return pointer[0];
  }

  private callFunction(definition: ElsterFunktion, args = [] as unknown[]) {
    const library = this.getEricLibrary();
    const func = library.func(definition.name, definition.result, definition.arguments);

    const result = func(...args);

    if (definition.result === 'int') {
      logger.info(`Function ${definition.name} returned code ${result}`);
    } else {
      return result;
    }
  }
}
